<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRouter } from 'vue-router'

import { products } from '@/data/products'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'
import { useWishlistStore } from '@/stores/wishlist'

type SortOption = 'default' | 'price-asc' | 'price-desc'

const PAGE_SIZE_OPTIONS = ['6', '12', '18']
const ALL_CATEGORY = '全部'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const uiStore = useUiStore()
const wishlistStore = useWishlistStore()
const { itemCount } = storeToRefs(cartStore)

const searchQuery = ref('')
const selectedCategory = ref(ALL_CATEGORY)
const selectedSort = ref<SortOption>('default')
const currentPage = ref(1)
const pageSize = ref(6)

const featuredProducts = computed(() => products.slice(0, 3))

const categoryOptions = computed(() =>
  [ALL_CATEGORY, ...new Set(products.map((product) => product.category))].map((category) => ({
    label: category,
    value: category,
  })),
)

const sortOptions = [
  { label: '預設順序', value: 'default' as const },
  { label: '價格低到高', value: 'price-asc' as const },
  { label: '價格高到低', value: 'price-desc' as const },
]

const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase())

const filteredProducts = computed(() => {
  const matches = products.filter((product) => {
    const matchesCategory =
      selectedCategory.value === ALL_CATEGORY || product.category === selectedCategory.value

    const searchableText = [product.name, product.category, product.description]
      .join(' ')
      .toLowerCase()

    const matchesQuery =
      normalizedQuery.value.length === 0 || searchableText.includes(normalizedQuery.value)

    return matchesCategory && matchesQuery
  })

  if (selectedSort.value === 'price-asc') {
    return [...matches].sort((left, right) => left.price - right.price)
  }

  if (selectedSort.value === 'price-desc') {
    return [...matches].sort((left, right) => right.price - left.price)
  }

  return matches
})

const totalItems = computed(() => filteredProducts.value.length)

const totalPages = computed(() => {
  if (totalItems.value === 0) {
    return 0
  }

  return Math.ceil(totalItems.value / pageSize.value)
})

const paginatedProducts = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  return filteredProducts.value.slice(startIndex, startIndex + pageSize.value)
})

const hasCatalogProducts = computed(() => products.length > 0)
const minimumPageSize = Number(PAGE_SIZE_OPTIONS[0])
const showPagination = computed(() => totalItems.value > minimumPageSize)

watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1
})

watch(totalPages, (nextTotalPages) => {
  if (nextTotalPages === 0) {
    currentPage.value = 1
    return
  }

  if (currentPage.value > nextTotalPages) {
    currentPage.value = nextTotalPages
  }
})

const currencyFormatter = new Intl.NumberFormat('zh-TW', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

function addToCart(productId: number, productName: string) {
  cartStore.addItem(productId)
  uiStore.showSuccessToast(`${productName} 已加入購物車。`, '已加入購物車')
}

function toggleFavorite(productId: number) {
  if (!authStore.isAuthenticated) {
    uiStore.showWarningToast('登入後才能使用收藏功能，請先登入會員帳號。')
    void router.push('/login')
    return
  }

  wishlistStore.toggleFavorite(productId)
}

function isFavorited(productId: number) {
  return wishlistStore.isFavorited(productId)
}

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = ALL_CATEGORY
  selectedSort.value = 'default'
  currentPage.value = 1
  pageSize.value = 6
}

function handlePageChange(page: number, nextPageSize: number) {
  const didPageSizeChange = pageSize.value !== nextPageSize

  pageSize.value = nextPageSize
  currentPage.value = didPageSizeChange ? 1 : page
}
</script>

<template>
  <main class="storefront-page">
    <section class="hero-card">
      <div class="hero-copy">
        <p class="eyebrow">Studio Selection</p>
        <h1>挑選讓日常更舒服的風格選物</h1>
        <p class="description">
          從居家、穿搭到桌面配件，我們整理了一系列兼具實用與美感的商品，讓你更輕鬆找到適合自己的生活提案。
        </p>

        <div class="hero-actions">
          <a href="#catalog" class="primary-button">開始逛商品</a>
          <div class="cart-pill">購物車商品 {{ itemCount }} 件</div>
        </div>
      </div>

      <div class="hero-grid">
        <article v-for="product in featuredProducts" :key="product.id" class="highlight-card">
          <RouterLink :to="`/products/${product.id}`" class="highlight-link">
            <img :src="product.image" :alt="product.name" />
          </RouterLink>
          <div>
            <p>{{ product.category }}</p>
            <RouterLink :to="`/products/${product.id}`" class="product-title-link">
              <strong>{{ product.name }}</strong>
            </RouterLink>
          </div>
        </article>
      </div>
    </section>

    <section id="catalog" class="catalog-section">
      <div class="section-heading">
        <p class="eyebrow">Catalog</p>
        <h2>用搜尋、分類、排序與分頁快速找到想要的商品</h2>
      </div>

      <div class="catalog-toolbar">
        <label class="search-field">
          <span>搜尋商品</span>
          <a-input
            v-model:value="searchQuery"
            type="search"
            placeholder="輸入商品名稱、分類或描述關鍵字"
            size="large"
          />
        </label>

        <label class="filter-field">
          <span>商品分類</span>
          <a-select
            v-model:value="selectedCategory"
            :options="categoryOptions"
            class="toolbar-select"
          />
        </label>

        <label class="filter-field">
          <span>價格排序</span>
          <a-select v-model:value="selectedSort" :options="sortOptions" class="toolbar-select" />
        </label>

        <button type="button" class="clear-button" @click="clearFilters">清除條件</button>
      </div>

      <div v-if="!hasCatalogProducts" class="empty-state">
        <h3>目前沒有可顯示的商品</h3>
        <p>商品資料暫時為空，請稍後再回來看看最新選品。</p>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="empty-state">
        <h3>找不到符合條件的商品</h3>
        <p>可以試著調整搜尋字詞、切換分類，或清除目前條件重新查看全部商品。</p>
        <button type="button" class="primary-button empty-action" @click="clearFilters">
          清除條件並顯示全部商品
        </button>
      </div>

      <template v-else>
        <div class="catalog-status">
          <p>共 {{ totalItems }} 件商品，目前第 {{ currentPage }} / {{ totalPages }} 頁</p>
          <p>每頁顯示 {{ pageSize }} 件商品</p>
        </div>

        <div class="product-grid">
          <article v-for="product in paginatedProducts" :key="product.id" class="product-card">
            <RouterLink :to="`/products/${product.id}`" class="product-image-link">
              <img :src="product.image" :alt="product.name" />
            </RouterLink>
            <div class="product-copy">
              <div class="product-meta">
                <span>{{ product.category }}</span>
                <strong>{{ formatCurrency(product.price) }}</strong>
              </div>
              <RouterLink :to="`/products/${product.id}`" class="product-title-link">
                <h3>{{ product.name }}</h3>
              </RouterLink>
              <p>{{ product.description }}</p>
            </div>
            <div class="product-actions">
              <RouterLink :to="`/products/${product.id}`" class="detail-link">查看詳情</RouterLink>

              <div class="icon-actions">
                <button
                  type="button"
                  class="wishlist-icon-button"
                  :class="{ active: isFavorited(product.id) }"
                  :aria-label="isFavorited(product.id) ? `取消收藏 ${product.name}` : `收藏 ${product.name}`"
                  @click="toggleFavorite(product.id)"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M12 20.25 4.8 13.41a4.52 4.52 0 0 1 0-6.48 4.73 4.73 0 0 1 6.6 0L12 7.51l.6-.58a4.73 4.73 0 0 1 6.6 0 4.52 4.52 0 0 1 0 6.48Z"
                      :fill="isFavorited(product.id) ? 'currentColor' : 'none'"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.8"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  class="cart-icon-button"
                  :aria-label="`將 ${product.name} 加入購物車`"
                  @click="addToCart(product.id, product.name)"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M3 4.75h2.05l1.42 7.09a1 1 0 0 0 .98.8h8.77a1 1 0 0 0 .97-.76l1.58-6.38H7.24"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.8"
                    />
                    <circle cx="10" cy="18.25" r="1.35" fill="currentColor" />
                    <circle cx="17" cy="18.25" r="1.35" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>

        <div v-if="showPagination" class="pagination-bar">
          <a-pagination
            :current="currentPage"
            :total="totalItems"
            :page-size="pageSize"
            :page-size-options="PAGE_SIZE_OPTIONS"
            :show-size-changer="true"
            :show-less-items="true"
            :responsive="true"
            @change="handlePageChange"
            @show-size-change="handlePageChange"
          />
        </div>
      </template>
    </section>
  </main>
</template>

<style scoped>
.storefront-page {
  display: grid;
  gap: 2rem;
  padding: 1rem 0 4rem;
}

.hero-card {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
  padding: 2rem;
  border: 1px solid var(--color-border);
  border-radius: 32px;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.7), transparent 36%),
    linear-gradient(135deg, rgba(15, 118, 110, 0.08), rgba(214, 158, 46, 0.1)),
    var(--color-surface);
  box-shadow: var(--shadow-card);
}

.hero-copy h1,
.section-heading h2 {
  margin-top: 0.45rem;
  font-size: clamp(2.4rem, 6vw, 4.75rem);
  line-height: 0.98;
  font-weight: 800;
  color: var(--color-heading);
}

.description {
  margin-top: 1rem;
  max-width: 38rem;
  color: var(--color-text-soft);
  font-size: 1.05rem;
}

.eyebrow {
  color: var(--color-accent);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-weight: 700;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.5rem;
}

.primary-button,
.cart-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.95rem 1.2rem;
  font-weight: 700;
}

.primary-button {
  border: 0;
  background: var(--color-accent);
  color: #f7fbfc;
  text-decoration: none;
  cursor: pointer;
}

.cart-pill {
  background: rgba(15, 118, 110, 0.08);
  color: var(--color-heading);
}

.hero-grid {
  display: grid;
  gap: 1rem;
}

.highlight-card,
.product-card,
.catalog-toolbar,
.empty-state,
.catalog-status,
.pagination-bar {
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.76);
  overflow: hidden;
}

.highlight-card {
  display: grid;
  grid-template-columns: 6rem minmax(0, 1fr);
  align-items: center;
}

.highlight-link,
.product-image-link {
  display: block;
}

.highlight-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.highlight-card div {
  padding: 1rem;
}

.highlight-card p,
.product-meta span,
.catalog-toolbar span {
  color: var(--color-accent);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.highlight-card strong,
.product-card h3 {
  display: block;
  margin-top: 0.25rem;
  color: var(--color-heading);
  font-size: 1.1rem;
  font-weight: 700;
}

.product-title-link {
  color: inherit;
}

.catalog-section {
  display: grid;
  gap: 1.25rem;
}

.section-heading h2 {
  font-size: clamp(2rem, 5vw, 3rem);
}

.catalog-toolbar {
  display: grid;
  grid-template-columns: minmax(0, 2fr) repeat(2, minmax(12rem, 1fr)) auto;
  gap: 1rem;
  padding: 1rem;
}

.search-field,
.filter-field {
  display: grid;
  gap: 0.45rem;
}

.toolbar-select {
  width: 100%;
}

:deep(.search-field .ant-input),
:deep(.toolbar-select .ant-select-selector) {
  min-height: 52px;
  border-radius: 16px !important;
  border-color: var(--color-border) !important;
  background: rgba(255, 255, 255, 0.88) !important;
  box-shadow: none !important;
  padding: 0 0.95rem !important;
}

:deep(.search-field .ant-input) {
  color: var(--color-heading);
}

:deep(.toolbar-select .ant-select-selection-item),
:deep(.toolbar-select .ant-select-selection-placeholder) {
  line-height: 50px !important;
  color: var(--color-heading);
}

.clear-button {
  align-self: end;
  border: 0;
  border-radius: 999px;
  padding: 0.85rem 1rem;
  background: rgba(15, 118, 110, 0.08);
  color: var(--color-accent);
  font-weight: 700;
  cursor: pointer;
}

.catalog-status {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  color: var(--color-heading);
  font-weight: 600;
}

.catalog-status p:last-child {
  color: var(--color-text-soft);
  font-weight: 500;
}

.empty-state {
  display: grid;
  gap: 0.75rem;
  justify-items: start;
  padding: 1.5rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-heading);
}

.empty-state p {
  color: var(--color-text-soft);
}

.empty-action {
  margin-top: 0.4rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.product-card {
  display: grid;
  align-content: start;
}

.product-card img {
  width: 100%;
  aspect-ratio: 1.1;
  object-fit: cover;
}

.product-copy {
  display: grid;
  gap: 0.75rem;
  padding: 1rem 1rem 0;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.product-meta strong {
  color: var(--color-heading);
}

.product-copy p {
  color: var(--color-text-soft);
}

.product-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem;
}

.detail-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.8rem 1rem;
  background: rgba(15, 118, 110, 0.08);
  color: var(--color-accent);
  font-weight: 700;
}

.icon-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.wishlist-icon-button,
.cart-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  padding: 0;
  border-radius: 999px;
  cursor: pointer;
}

.wishlist-icon-button {
  border: 1px solid var(--color-border);
  background: #fff;
  color: #111827;
}

.wishlist-icon-button.active {
  color: #dc2626;
}

.cart-icon-button {
  border: 0;
  background: #22c55e;
  color: #f7fbfc;
  box-shadow: 0 0.75rem 1.5rem rgba(34, 197, 94, 0.24);
}

.wishlist-icon-button svg,
.cart-icon-button svg {
  width: 1.2rem;
  height: 1.2rem;
}

.pagination-bar {
  display: flex;
  justify-content: center;
  padding: 1.25rem;
  overflow: visible;
}

:deep(.ant-pagination) {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.35rem;
}

:deep(.ant-pagination .ant-pagination-item),
:deep(.ant-pagination .ant-pagination-prev),
:deep(.ant-pagination .ant-pagination-next) {
  border-radius: 999px;
  border-color: rgba(15, 118, 110, 0.18);
}

:deep(.ant-pagination .ant-pagination-item-active) {
  background: transparent !important;
  border-color: rgba(15, 118, 110, 0.18) !important;
}

:deep(.ant-pagination .ant-pagination-item-active a) {
  color: #2563eb !important;
}

:deep(.ant-pagination .ant-pagination-item-active:hover) {
  background: transparent !important;
  border-color: rgba(15, 118, 110, 0.18) !important;
}

:deep(.ant-pagination .ant-pagination-item-active:hover a) {
  color: #2563eb !important;
}

:deep(.ant-pagination .ant-pagination-item:hover),
:deep(.ant-pagination .ant-pagination-prev:hover),
:deep(.ant-pagination .ant-pagination-next:hover) {
  background: transparent !important;
  border-color: rgba(15, 118, 110, 0.18) !important;
  box-shadow: none !important;
}

:deep(.ant-pagination .ant-pagination-item:hover a),
:deep(.ant-pagination .ant-pagination-prev:hover .ant-pagination-item-link),
:deep(.ant-pagination .ant-pagination-next:hover .ant-pagination-item-link) {
  color: inherit !important;
  background-color: transparent !important;
}

:deep(.ant-pagination a:hover) {
  background-color: transparent !important;
}

@media (max-width: 1100px) {
  .catalog-toolbar {
    grid-template-columns: 1fr 1fr;
  }

  .search-field {
    grid-column: 1 / -1;
  }
}

@media (max-width: 960px) {
  .hero-card,
  .product-grid {
    grid-template-columns: 1fr;
  }

  .catalog-status {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 700px) {
  .catalog-toolbar {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRouter } from 'vue-router'

import { getBaseProductGallery, hasProductVariants, products, type Product } from '@/data/products'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'
import { useWishlistStore } from '@/stores/wishlist'

type SortOption = 'default' | 'price-asc' | 'price-desc'

const PAGE_SIZE_OPTIONS = ['6', '12', '18']
const ALL_CATEGORY = '全部分類'
const SKELETON_PRODUCT_COUNT = 6

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const uiStore = useUiStore()
const wishlistStore = useWishlistStore()
const { itemCount } = storeToRefs(cartStore)

const searchQuery = ref('')
const selectedCategory = ref(ALL_CATEGORY)
const selectedSort = ref<SortOption>('default')
const minPrice = ref('')
const maxPrice = ref('')
const quickViewProduct = ref<Product | null>(null)
const isQuickViewOpen = ref(false)
const currentPage = ref(1)
const pageSize = ref(6)
const isCatalogLoading = ref(true)

let catalogLoadTimer: number | undefined

const featuredProducts = computed(() => products.slice(0, 3))
const skeletonItems = computed(() => Array.from({ length: SKELETON_PRODUCT_COUNT }, (_, index) => index))

const categoryOptions = computed(() =>
  [ALL_CATEGORY, ...new Set(products.map((product) => product.category))].map((category) => ({
    label: category,
    value: category,
  })),
)

const sortOptions = [
  { label: '預設排序', value: 'default' as const },
  { label: '價格：低到高', value: 'price-asc' as const },
  { label: '價格：高到低', value: 'price-desc' as const },
]

const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase())
const normalizedMinPrice = computed(() => parsePriceInput(minPrice.value))
const normalizedMaxPrice = computed(() => parsePriceInput(maxPrice.value))
const hasActivePriceRange = computed(
  () => normalizedMinPrice.value !== null || normalizedMaxPrice.value !== null,
)
const isPriceRangeInvalid = computed(
  () =>
    normalizedMinPrice.value !== null &&
    normalizedMaxPrice.value !== null &&
    normalizedMinPrice.value > normalizedMaxPrice.value,
)
const activePriceRangeSummary = computed(() => {
  if (!hasActivePriceRange.value || isPriceRangeInvalid.value) {
    return ''
  }

  const minimumLabel =
    normalizedMinPrice.value === null ? '不限' : formatCurrency(normalizedMinPrice.value)
  const maximumLabel =
    normalizedMaxPrice.value === null ? '不限' : formatCurrency(normalizedMaxPrice.value)

  return `${minimumLabel} - ${maximumLabel}`
})

const filteredProducts = computed(() => {
  const matches = products.filter((product) => {
    const matchesCategory =
      selectedCategory.value === ALL_CATEGORY || product.category === selectedCategory.value

    const searchableText = [product.name, product.category, product.description]
      .join(' ')
      .toLowerCase()

    const matchesQuery =
      normalizedQuery.value.length === 0 || searchableText.includes(normalizedQuery.value)

    const matchesMinPrice =
      isPriceRangeInvalid.value ||
      normalizedMinPrice.value === null ||
      product.price >= normalizedMinPrice.value
    const matchesMaxPrice =
      isPriceRangeInvalid.value ||
      normalizedMaxPrice.value === null ||
      product.price <= normalizedMaxPrice.value

    return matchesCategory && matchesQuery && matchesMinPrice && matchesMaxPrice
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
const isPriceFilteredEmptyState = computed(
  () =>
    filteredProducts.value.length === 0 &&
    hasActivePriceRange.value &&
    !isPriceRangeInvalid.value,
)
const quickViewImages = computed(() =>
  quickViewProduct.value ? getBaseProductGallery(quickViewProduct.value) : [],
)
const quickViewPrimaryImage = computed(() => quickViewImages.value[0] ?? '')
const quickViewActionLabel = computed(() => {
  if (!quickViewProduct.value) {
    return '加入購物車'
  }

  return hasProductVariants(quickViewProduct.value) ? '前往選擇規格' : '加入購物車'
})

watch([searchQuery, selectedCategory, selectedSort, minPrice, maxPrice], () => {
  currentPage.value = 1
})

watch(isPriceRangeInvalid, (isInvalid, wasInvalid) => {
  if (isInvalid && !wasInvalid) {
    uiStore.showWarningToast('最低價格不能高於最高價格。請重新調整價格區間。', '價格區間無效')
  }
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

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

onMounted(() => {
  startCatalogLoading()
  window.addEventListener('keydown', handleQuickViewKeydown)
})

onBeforeUnmount(() => {
  if (catalogLoadTimer !== undefined) {
    window.clearTimeout(catalogLoadTimer)
  }

  window.removeEventListener('keydown', handleQuickViewKeydown)
})

function startCatalogLoading() {
  isCatalogLoading.value = true

  if (catalogLoadTimer !== undefined) {
    window.clearTimeout(catalogLoadTimer)
  }

  catalogLoadTimer = window.setTimeout(() => {
    isCatalogLoading.value = false
  }, 260)
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

function parsePriceInput(value: string) {
  const trimmedValue = value.trim()

  if (trimmedValue.length === 0) {
    return null
  }

  const parsedValue = Number(trimmedValue)

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return null
  }

  return parsedValue
}

function addToCart(productId: number, productName: string) {
  const product = products.find((entry) => entry.id === productId)

  if (!product) {
    return
  }

  if (hasProductVariants(product)) {
    uiStore.showWarningToast('請先到商品頁選擇規格，再加入購物車。', '請先選擇規格')
    void router.push(`/products/${productId}`)
    return
  }

  cartStore.addItem(productId)
  uiStore.showSuccessToast(`${productName} 已加入購物車。`, '加入成功')
}

function openQuickView(product: Product) {
  quickViewProduct.value = product
  isQuickViewOpen.value = true
}

function closeQuickView() {
  isQuickViewOpen.value = false
  quickViewProduct.value = null
}

function handleQuickViewKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isQuickViewOpen.value) {
    closeQuickView()
  }
}

function openQuickViewDetail() {
  if (!quickViewProduct.value) {
    return
  }

  const productId = quickViewProduct.value.id
  closeQuickView()
  void router.push(`/products/${productId}`)
}

function handleQuickViewPrimaryAction() {
  if (!quickViewProduct.value) {
    return
  }

  const { id, name } = quickViewProduct.value
  closeQuickView()
  addToCart(id, name)
}

function toggleFavorite(productId: number) {
  if (!authStore.isAuthenticated) {
    uiStore.showWarningToast('請先登入再收藏商品。')
    void router.push('/login')
    return
  }

  const added = wishlistStore.toggleFavorite(productId)
  uiStore.showSuccessToast(
    added ? '已加入收藏清單。' : '已從收藏清單移除。',
    added ? '收藏成功' : '已更新',
  )
}

function isFavorited(productId: number) {
  return wishlistStore.isFavorited(productId)
}

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = ALL_CATEGORY
  selectedSort.value = 'default'
  clearPriceRange()
  currentPage.value = 1
  pageSize.value = 6
}

function clearPriceRange() {
  minPrice.value = ''
  maxPrice.value = ''
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
        <p class="eyebrow">精選選物</p>
        <h1>為日常節奏挑選更耐看、更好用的物件。</h1>
        <p class="description">
          從家具、咖啡器具到旅行與桌面用品，為你整理出適合居家與工作場景的生活選物。
        </p>

        <div class="hero-actions">
          <a href="#catalog" class="primary-button">開始瀏覽</a>
          <div class="cart-pill">購物車：{{ itemCount }} 件商品</div>
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
        <p class="eyebrow">商品列表</p>
        <h2>依關鍵字、分類與價格快速縮小你想看的商品範圍。</h2>
      </div>

      <div class="catalog-toolbar">
        <label class="search-field">
          <span>搜尋</span>
          <a-input
            v-model:value="searchQuery"
            type="search"
            placeholder="輸入商品名稱、分類或描述"
            size="large"
          />
        </label>

        <label class="filter-field">
          <span>分類</span>
          <a-select
            v-model:value="selectedCategory"
            :options="categoryOptions"
            class="toolbar-select"
          />
        </label>

        <label class="filter-field">
          <span>排序</span>
          <a-select v-model:value="selectedSort" :options="sortOptions" class="toolbar-select" />
        </label>

        <label class="price-range-field">
          <span>價格區間</span>
          <div class="price-range-inputs">
            <a-input
              v-model:value="minPrice"
              type="number"
              inputmode="numeric"
              min="0"
              placeholder="最低價"
              size="large"
            />
            <span class="price-range-separator">至</span>
            <a-input
              v-model:value="maxPrice"
              type="number"
              inputmode="numeric"
              min="0"
              placeholder="最高價"
              size="large"
            />
          </div>
        </label>

        <div class="toolbar-actions">
          <button
            type="button"
            class="secondary-button"
            :disabled="!hasActivePriceRange"
            @click="clearPriceRange"
          >
            清除價格區間
          </button>
          <button type="button" class="clear-button" @click="clearFilters">清除篩選</button>
        </div>
      </div>

      <div v-if="!hasCatalogProducts" class="empty-state">
        <h3>目前沒有可顯示的商品</h3>
        <p>商品資料尚未建立完成，請稍後再回來，或先到其他頁面繼續瀏覽。</p>
      </div>

      <template v-else-if="isCatalogLoading">
        <div class="catalog-status loading-status">
          <p>正在準備商品列表...</p>
          <p>請稍候，內容即將顯示。</p>
        </div>

        <div class="product-grid skeleton-grid" aria-hidden="true">
          <article v-for="item in skeletonItems" :key="item" class="product-card skeleton-card">
            <div class="skeleton-media"></div>
            <div class="product-copy">
              <div class="skeleton-line skeleton-line-short"></div>
              <div class="skeleton-line skeleton-line-title"></div>
              <div class="skeleton-line"></div>
              <div class="skeleton-line skeleton-line-medium"></div>
            </div>
            <div class="product-actions">
              <div class="skeleton-pill"></div>
              <div class="skeleton-icon-group">
                <div class="skeleton-icon"></div>
                <div class="skeleton-icon"></div>
              </div>
            </div>
          </article>
        </div>
      </template>

      <div v-else-if="filteredProducts.length === 0" class="empty-state">
        <template v-if="isPriceFilteredEmptyState">
          <h3>目前沒有商品落在這個價格區間</h3>
          <p>你可以放寬最低價或最高價，或直接清除價格區間後重新查看完整商品列表。</p>
          <button type="button" class="primary-button empty-action" @click="clearPriceRange">
            清除價格區間
          </button>
        </template>

        <template v-else>
          <h3>找不到符合條件的商品</h3>
          <p>你可以調整搜尋關鍵字、切換分類，或清除目前篩選後重新瀏覽完整商品列表。</p>
          <button type="button" class="primary-button empty-action" @click="clearFilters">
            重設篩選
          </button>
        </template>
      </div>

      <template v-else>
        <div class="catalog-status">
          <p>共找到 {{ totalItems }} 件商品，目前第 {{ currentPage }} / {{ totalPages }} 頁。</p>
          <p>
            每頁顯示 {{ pageSize }} 件商品
            <template v-if="hasActivePriceRange && !isPriceRangeInvalid">
              ，目前價格區間為 {{ activePriceRangeSummary }}
            </template>
            。
          </p>
        </div>

        <div class="product-grid">
          <article v-for="product in paginatedProducts" :key="product.id" class="product-card">
            <RouterLink :to="`/products/${product.id}`" class="product-image-link">
              <span
                v-if="product.saleBadge"
                class="sale-badge"
                :class="`sale-badge-${product.saleBadge.variant ?? 'sale'}`"
              >
                {{ product.saleBadge.label }}
              </span>
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
              <span v-if="hasProductVariants(product)" class="variant-badge">請先到商品頁選擇規格</span>
            </div>
            <div class="product-actions">
              <div class="card-link-group">
                <button type="button" class="quick-view-button" @click="openQuickView(product)">
                  快速預覽
                </button>
                <RouterLink :to="`/products/${product.id}`" class="detail-link">查看商品</RouterLink>
              </div>

              <div class="icon-actions">
                <button
                  type="button"
                  class="wishlist-icon-button"
                  :class="{ active: isFavorited(product.id) }"
                  :aria-label="isFavorited(product.id) ? `將 ${product.name} 移出收藏` : `收藏 ${product.name}`"
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
                  :aria-label="hasProductVariants(product) ? `為 ${product.name} 選擇規格` : `將 ${product.name} 加入購物車`"
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

    <teleport to="body">
      <div v-if="isQuickViewOpen && quickViewProduct" class="quick-view-modal" @click.self="closeQuickView">
        <div
          class="quick-view-dialog"
          role="dialog"
          aria-modal="true"
          :aria-label="`${quickViewProduct.name} 快速預覽`"
        >
          <button type="button" class="quick-view-close" @click="closeQuickView">關閉</button>

          <div class="quick-view-layout">
            <div class="quick-view-media">
              <span
                v-if="quickViewProduct.saleBadge"
                class="sale-badge"
                :class="`sale-badge-${quickViewProduct.saleBadge.variant ?? 'sale'}`"
              >
                {{ quickViewProduct.saleBadge.label }}
              </span>
              <img
                v-if="quickViewPrimaryImage"
                :src="quickViewPrimaryImage"
                :alt="quickViewProduct.name"
              />
              <div v-else class="quick-view-image-fallback">
                <strong>目前沒有可顯示的商品圖片</strong>
                <p>你仍然可以查看商品資訊，或前往商品頁查看更多內容。</p>
              </div>

              <p v-if="quickViewImages.length > 1" class="quick-view-gallery-note">
                此商品目前有 {{ quickViewImages.length }} 張圖片可於商品頁查看。
              </p>
            </div>

            <div class="quick-view-copy">
              <p class="eyebrow">Quick View</p>
              <div class="quick-view-heading">
                <span>{{ quickViewProduct.category }}</span>
                <strong>{{ formatCurrency(quickViewProduct.price) }}</strong>
              </div>
              <h3>{{ quickViewProduct.name }}</h3>
              <p>{{ quickViewProduct.description }}</p>
              <span v-if="hasProductVariants(quickViewProduct)" class="variant-badge">
                此商品需要先在商品頁選擇規格
              </span>

              <div class="quick-view-actions">
                <button type="button" class="primary-button" @click="handleQuickViewPrimaryAction">
                  {{ quickViewActionLabel }}
                </button>
                <button
                  type="button"
                  class="secondary-button quick-view-detail-button"
                  @click="openQuickViewDetail"
                >
                  前往商品詳情
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
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

.product-image-link {
  position: relative;
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
  grid-template-columns: minmax(0, 2fr) repeat(2, minmax(10rem, 1fr)) minmax(0, 1.45fr) auto;
  gap: 1rem;
  padding: 1rem;
}

.search-field,
.filter-field,
.price-range-field {
  display: grid;
  gap: 0.45rem;
}

.toolbar-select {
  width: 100%;
}

:deep(.search-field .ant-input),
:deep(.price-range-inputs .ant-input),
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

.price-range-inputs {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 0.5rem;
  align-items: center;
}

.price-range-separator {
  color: var(--color-text-soft);
  font-weight: 700;
}

:deep(.toolbar-select .ant-select-selection-item),
:deep(.toolbar-select .ant-select-selection-placeholder) {
  line-height: 50px !important;
  color: var(--color-heading);
}

.toolbar-actions {
  display: flex;
  align-items: end;
  gap: 0.75rem;
}

.secondary-button,
.clear-button {
  border: 0;
  border-radius: 999px;
  padding: 0.85rem 1rem;
  font-weight: 700;
  cursor: pointer;
}

.secondary-button {
  background: rgba(15, 118, 110, 0.12);
  color: var(--color-accent);
}

.secondary-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.clear-button {
  align-self: end;
  background: rgba(15, 118, 110, 0.08);
  color: var(--color-accent);
}

.catalog-status {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  color: var(--color-heading);
  font-weight: 600;
}

.catalog-status p:last-child,
.loading-status p:last-child {
  color: var(--color-text-soft);
  font-weight: 500;
}

.loading-status {
  background: rgba(255, 255, 255, 0.9);
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

.quick-view-modal {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: start center;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(10px);
  overflow-y: auto;
}

.quick-view-dialog {
  width: min(100%, 56rem);
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 2rem 4rem rgba(15, 23, 42, 0.26);
  margin: auto 0;
}

.quick-view-close {
  justify-self: end;
  border: 0;
  border-radius: 999px;
  padding: 0.7rem 1rem;
  background: rgba(15, 118, 110, 0.08);
  color: var(--color-accent);
  font-weight: 700;
  cursor: pointer;
}

.quick-view-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.25rem;
}

.quick-view-media,
.quick-view-copy {
  display: grid;
  gap: 0.9rem;
}

.quick-view-media {
  position: relative;
}

.quick-view-media img,
.quick-view-image-fallback {
  width: 100%;
  min-height: 18rem;
  border-radius: 24px;
  border: 1px solid var(--color-border);
  background: rgba(248, 250, 252, 0.9);
}

.quick-view-media img {
  object-fit: cover;
}

.quick-view-image-fallback {
  display: grid;
  place-items: center;
  align-content: center;
  padding: 1.5rem;
  text-align: center;
}

.quick-view-image-fallback p,
.quick-view-gallery-note,
.quick-view-copy p {
  color: var(--color-text-soft);
}

.quick-view-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.quick-view-heading span {
  color: var(--color-accent);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.quick-view-heading strong {
  color: var(--color-heading);
  font-size: 1.2rem;
}

.quick-view-copy h3 {
  margin: 0;
  color: var(--color-heading);
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  line-height: 1;
}

.quick-view-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.35rem;
}

.quick-view-detail-button {
  background: rgba(15, 118, 110, 0.08);
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
  min-height: 3rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.variant-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: rgba(245, 158, 11, 0.14);
  color: #92400e;
  font-size: 0.82rem;
  font-weight: 700;
}

.sale-badge {
  position: absolute;
  top: 0.9rem;
  left: 0.9rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: calc(100% - 1.8rem);
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  color: #fff7ed;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  box-shadow: 0 0.75rem 1.5rem rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(8px);
}

.sale-badge-sale {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.96), rgba(249, 115, 22, 0.92));
}

.sale-badge-limited {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(8, 145, 178, 0.92));
}

.sale-badge-new {
  background: linear-gradient(135deg, rgba(5, 150, 105, 0.94), rgba(16, 185, 129, 0.9));
}

.product-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem;
}

.card-link-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.quick-view-button,
.detail-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.8rem 1rem;
  color: var(--color-accent);
  font-weight: 700;
}

.quick-view-button {
  border: 1px solid rgba(15, 118, 110, 0.18);
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
}

.detail-link {
  background: rgba(15, 118, 110, 0.08);
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

.skeleton-grid .product-card {
  background: rgba(255, 255, 255, 0.88);
}

.skeleton-media,
.skeleton-line,
.skeleton-pill,
.skeleton-icon {
  background: linear-gradient(
    90deg,
    rgba(226, 232, 240, 0.85) 25%,
    rgba(241, 245, 249, 1) 50%,
    rgba(226, 232, 240, 0.85) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.3s linear infinite;
}

.skeleton-media {
  width: 100%;
  aspect-ratio: 1.1;
}

.skeleton-line {
  height: 0.85rem;
  border-radius: 999px;
}

.skeleton-line-short {
  width: 30%;
}

.skeleton-line-title {
  width: 72%;
  height: 1.2rem;
}

.skeleton-line-medium {
  width: 60%;
}

.skeleton-pill {
  width: 6rem;
  height: 2.5rem;
  border-radius: 999px;
}

.skeleton-icon-group {
  display: flex;
  gap: 0.65rem;
}

.skeleton-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
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

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
}

@media (max-width: 1100px) {
  .catalog-toolbar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .search-field,
  .price-range-field,
  .toolbar-actions {
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

  .toolbar-actions {
    flex-wrap: wrap;
  }

  .quick-view-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .catalog-toolbar {
    grid-template-columns: 1fr;
  }

  .price-range-inputs {
    grid-template-columns: 1fr;
  }

  .price-range-separator {
    justify-self: center;
  }

  .toolbar-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .product-actions,
  .quick-view-actions,
  .card-link-group {
    flex-direction: column;
    align-items: stretch;
  }

  .quick-view-modal {
    padding: 1rem;
  }

  .quick-view-dialog {
    padding: 1rem;
  }
}
</style>

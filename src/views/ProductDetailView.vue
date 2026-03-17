<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import {
  findMatchingVariantCombination,
  findProductById,
  getRelatedProducts,
  getProductVariantSelectionSummary,
  hasProductVariants,
  isProductVariantSelectionComplete,
  isVariantValueAvailable,
  parseProductId,
  type ProductVariantSelection,
} from '@/data/products'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useProfileStore } from '@/stores/profile'
import { useRecentlyViewedStore } from '@/stores/recentlyViewed'
import { useReviewStore } from '@/stores/reviews'
import { useUiStore } from '@/stores/ui'
import { useWishlistStore } from '@/stores/wishlist'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const profileStore = useProfileStore()
const uiStore = useUiStore()
const wishlistStore = useWishlistStore()
const recentlyViewedStore = useRecentlyViewedStore()
const reviewStore = useReviewStore()

const reviewForm = reactive({
  rating: 5,
  content: '',
})

const variantSelection = reactive<ProductVariantSelection>({})
const isDetailLoading = reactive({ value: true })
let detailLoadTimer: number | undefined

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const productId = computed(() => parseProductId(route.params.productId))
const product = computed(() =>
  productId.value === null ? null : (findProductById(productId.value) ?? null),
)

const variantOptionGroups = computed(() => product.value?.variants?.optionGroups ?? [])
const relatedProducts = computed(() =>
  product.value ? getRelatedProducts(product.value.id, 4) : [],
)
const productReviews = computed(() =>
  product.value ? reviewStore.getReviewsForProduct(product.value.id) : [],
)
const existingUserReview = computed(() => {
  if (!product.value) {
    return null
  }

  const authorEmail = profileStore.profile.email.trim().toLowerCase()
  return (
    productReviews.value.find((review) => review.authorEmail.trim().toLowerCase() === authorEmail) ??
    null
  )
})

const selectionState = computed(() => {
  if (!product.value || !hasProductVariants(product.value)) {
    return {
      isComplete: true,
      isValid: true,
      message: '此商品可直接加入購物車。',
      summary: [] as string[],
    }
  }

  const complete = isProductVariantSelectionComplete(product.value, variantSelection)

  if (!complete) {
    return {
      isComplete: false,
      isValid: false,
      message: '請先選擇所有必填規格，才能加入購物車。',
      summary: getProductVariantSelectionSummary(product.value, variantSelection),
    }
  }

  const matchingCombination = findMatchingVariantCombination(product.value, variantSelection)

  if (!matchingCombination) {
    return {
      isComplete: true,
      isValid: false,
      message: '目前規格組合不可購買，請改選其他組合。',
      summary: getProductVariantSelectionSummary(product.value, variantSelection),
    }
  }

  return {
    isComplete: true,
    isValid: true,
    message: '目前規格可加入購物車。',
    summary: getProductVariantSelectionSummary(product.value, variantSelection),
  }
})

const canAddToCart = computed(() => {
  if (!product.value) {
    return false
  }

  if (!hasProductVariants(product.value)) {
    return true
  }

  return selectionState.value.isComplete && selectionState.value.isValid
})

const isReviewFormValid = computed(() => {
  const trimmedContent = reviewForm.content.trim()
  return (
    Number.isInteger(reviewForm.rating) &&
    reviewForm.rating >= 1 &&
    reviewForm.rating <= 5 &&
    trimmedContent.length > 0
  )
})

watch(
  productId,
  () => {
    startDetailLoading()
  },
  { immediate: true },
)

watch(
  product,
  (nextProduct) => {
    Object.keys(variantSelection).forEach((key) => {
      delete variantSelection[key]
    })

    if (!nextProduct) {
      return
    }

    recentlyViewedStore.recordProductView(nextProduct.id)
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (detailLoadTimer !== undefined) {
    window.clearTimeout(detailLoadTimer)
  }
})

function startDetailLoading() {
  isDetailLoading.value = true

  if (detailLoadTimer !== undefined) {
    window.clearTimeout(detailLoadTimer)
  }

  detailLoadTimer = window.setTimeout(() => {
    isDetailLoading.value = false
  }, 260)
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

function isFavorited(productId: number) {
  return wishlistStore.isFavorited(productId)
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

function chooseVariant(groupId: string, value: string) {
  if (!product.value || !isVariantValueAvailable(product.value, groupId, value, variantSelection)) {
    return
  }

  variantSelection[groupId] = value
}

function isVariantSelected(groupId: string, value: string) {
  return variantSelection[groupId] === value
}

function isVariantDisabled(groupId: string, value: string) {
  if (!product.value) {
    return true
  }

  return !isVariantValueAvailable(product.value, groupId, value, variantSelection)
}

function addToCart() {
  if (!product.value) {
    return
  }

  const added = cartStore.addItem(product.value.id, variantSelection)

  if (!added) {
    uiStore.showWarningToast(selectionState.value.message)
    return
  }

  uiStore.showSuccessToast(`${product.value.name} 已加入購物車。`, '加入成功')
}

function submitReview() {
  if (!product.value) {
    return
  }

  if (!authStore.isAuthenticated) {
    uiStore.showWarningToast('請先登入再留下評論。')
    void router.push('/login')
    return
  }

  if (!isReviewFormValid.value) {
    uiStore.showWarningToast('請選擇 1 到 5 分，並輸入簡短評論內容。')
    return
  }

  reviewStore.createReview({
    productId: product.value.id,
    authorName: profileStore.profile.name,
    authorEmail: profileStore.profile.email,
    rating: reviewForm.rating,
    content: reviewForm.content,
  })

  reviewForm.rating = 5
  reviewForm.content = ''
  uiStore.showSuccessToast('你的評論已顯示在這個商品頁面上。', '評論已送出')
}
</script>

<template>
  <main class="product-detail-page">
    <template v-if="isDetailLoading.value">
      <section class="detail-shell skeleton-detail-shell" aria-hidden="true">
        <div class="skeleton-detail-media"></div>
        <div class="detail-copy">
          <div class="skeleton-line skeleton-line-short"></div>
          <div class="skeleton-line skeleton-line-medium"></div>
          <div class="skeleton-line skeleton-line-title"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-pill-row">
            <div class="skeleton-pill"></div>
            <div class="skeleton-pill"></div>
            <div class="skeleton-pill"></div>
          </div>
          <div class="skeleton-action-row">
            <div class="skeleton-button"></div>
            <div class="skeleton-icon"></div>
            <div class="skeleton-icon"></div>
          </div>
        </div>
      </section>
    </template>

    <section v-else-if="product" class="detail-shell">
      <div class="detail-media">
        <img :src="product.image" :alt="product.name" />
      </div>

      <div class="detail-copy">
        <RouterLink to="/" class="back-link">返回商店首頁</RouterLink>
        <p class="eyebrow">{{ product.category }}</p>
        <h1>{{ product.name }}</h1>
        <p class="price">{{ formatCurrency(product.price) }}</p>
        <p class="description">{{ product.description }}</p>

        <section v-if="variantOptionGroups.length > 0" class="variant-card">
          <div class="variant-header">
            <div>
              <p class="section-label">商品規格</p>
              <h2>選擇你的商品配置</h2>
            </div>
            <span
              class="availability-chip"
              :class="{ ready: selectionState.isValid && selectionState.isComplete }"
            >
              {{ selectionState.isValid && selectionState.isComplete ? '可購買' : '尚未完成選擇' }}
            </span>
          </div>

          <div class="variant-groups">
            <div v-for="group in variantOptionGroups" :key="group.id" class="variant-group">
              <div class="group-heading">
                <strong>{{ group.label }}</strong>
                <span>{{ variantSelection[group.id] ?? '請選擇' }}</span>
              </div>

              <div class="variant-values">
                <button
                  v-for="value in group.values"
                  :key="value"
                  type="button"
                  class="variant-value"
                  :class="{ selected: isVariantSelected(group.id, value) }"
                  :disabled="isVariantDisabled(group.id, value)"
                  @click="chooseVariant(group.id, value)"
                >
                  {{ value }}
                </button>
              </div>
            </div>
          </div>

          <p
            class="selection-message"
            :class="{ invalid: !selectionState.isValid || !selectionState.isComplete }"
          >
            {{ selectionState.message }}
          </p>

          <ul v-if="selectionState.summary.length > 0" class="selection-summary">
            <li v-for="item in selectionState.summary" :key="item">{{ item }}</li>
          </ul>
        </section>

        <div class="detail-actions">
          <button type="button" class="primary-action" :disabled="!canAddToCart" @click="addToCart">
            加入購物車
          </button>

          <div class="icon-actions">
            <RouterLink to="/cart" class="secondary-action">查看購物車</RouterLink>
            <button
              type="button"
              class="icon-button wishlist-button"
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
          </div>
        </div>
      </div>
    </section>

    <section v-if="!isDetailLoading.value && product" class="related-products-shell">
      <div class="related-products-header">
        <div>
          <p class="eyebrow">Related Products</p>
          <h2>你可能也會喜歡</h2>
          <p>看看同分類中的其他商品，延續你的瀏覽節奏。</p>
        </div>
      </div>

      <div v-if="relatedProducts.length > 0" class="related-products-grid">
        <article
          v-for="relatedProduct in relatedProducts"
          :key="relatedProduct.id"
          class="related-product-card"
        >
          <RouterLink :to="`/products/${relatedProduct.id}`" class="related-product-image-link">
            <img :src="relatedProduct.image" :alt="relatedProduct.name" />
          </RouterLink>

          <div class="related-product-copy">
            <p class="related-product-category">{{ relatedProduct.category }}</p>
            <RouterLink :to="`/products/${relatedProduct.id}`" class="related-product-title-link">
              <h3>{{ relatedProduct.name }}</h3>
            </RouterLink>
            <p class="related-product-description">{{ relatedProduct.description }}</p>
            <div class="related-product-footer">
              <strong>{{ formatCurrency(relatedProduct.price) }}</strong>
              <RouterLink :to="`/products/${relatedProduct.id}`" class="related-product-link">
                查看商品
              </RouterLink>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="section-empty-state">
        <h3>目前沒有相關商品</h3>
        <p>這個分類中的可推薦商品暫時不足，你可以回到首頁繼續探索其他商品。</p>
        <RouterLink to="/" class="secondary-action">回到商店首頁</RouterLink>
      </div>
    </section>

    <section v-if="!isDetailLoading.value && product" class="reviews-shell">
      <div class="reviews-header">
        <div>
          <p class="eyebrow">評論</p>
          <h2>看看其他人怎麼說</h2>
          <p>所有訪客都能閱讀評論，登入會員後也可以留下自己的使用心得。</p>
        </div>
        <span class="review-count">{{ productReviews.length }} 則評論</span>
      </div>

      <div class="reviews-layout">
        <section class="review-form-card">
          <template v-if="authStore.isAuthenticated">
            <p class="section-label">
              {{ existingUserReview ? '再寫一則評論' : '留下評論' }}
            </p>

            <form class="review-form" @submit.prevent="submitReview">
              <label>
                評分
                <a-rate v-model:value="reviewForm.rating" :count="5" />
              </label>

              <label>
                評論內容
                <a-textarea
                  v-model:value="reviewForm.content"
                  :rows="5"
                  placeholder="分享商品手感、使用方式或整體體驗。"
                />
              </label>

              <button type="submit" class="primary-action" :disabled="!isReviewFormValid">
                送出評論
              </button>
            </form>
          </template>

          <template v-else>
            <p class="section-label">登入後可評論</p>
            <p class="signin-copy">你仍然可以閱讀下方評論，想分享心得時再登入即可。</p>
            <RouterLink to="/login" class="secondary-action sign-in-link">前往登入</RouterLink>
          </template>
        </section>

        <section class="review-list-card">
          <p class="section-label">最新評論</p>

          <div v-if="productReviews.length === 0" class="review-empty-state">
            <h3>目前還沒有評論</h3>
            <p>成為第一個分享這項商品外觀、手感與日常使用體驗的人吧。</p>
          </div>

          <div v-else class="review-list">
            <article v-for="review in productReviews" :key="review.id" class="review-item">
              <div class="review-meta">
                <div>
                  <strong>{{ review.authorName }}</strong>
                  <p>{{ formatDate(review.submittedAt) }}</p>
                </div>
                <a-rate :value="review.rating" :count="5" disabled />
              </div>

              <p class="review-content">{{ review.content }}</p>
            </article>
          </div>
        </section>
      </div>
    </section>

    <section v-else-if="!isDetailLoading.value" class="not-found-card">
      <p class="eyebrow">找不到商品</p>
      <h1>目前找不到這項商品。</h1>
      <p>這個連結可能已失效，或商品已從目前的商店清單中移除。</p>

      <div class="not-found-actions">
        <RouterLink to="/" class="primary-action">返回商店首頁</RouterLink>
        <RouterLink to="/cart" class="secondary-action">開啟購物車</RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.product-detail-page {
  padding: 2rem 0 4rem;
  display: grid;
  gap: 1.5rem;
}

.detail-shell,
.reviews-shell,
.related-products-shell,
.not-found-card,
.review-form-card,
.review-list-card,
.variant-card {
  border: 1px solid var(--color-border);
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.72), transparent 35%),
    linear-gradient(135deg, rgba(15, 118, 110, 0.08), rgba(214, 158, 46, 0.08)),
    var(--color-surface);
  box-shadow: var(--shadow-card);
}

.detail-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: 1.5rem;
  padding: 1.5rem;
}

.detail-media img {
  width: 100%;
  height: 100%;
  min-height: 24rem;
  object-fit: cover;
  border-radius: 22px;
}

.detail-copy {
  display: grid;
  align-content: start;
  gap: 0.9rem;
  padding: 0.5rem 0;
}

.back-link {
  justify-self: start;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.08);
  color: var(--color-accent);
  font-weight: 700;
}

.eyebrow,
.section-label {
  color: var(--color-accent);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 700;
}

.detail-copy h1,
.not-found-card h1,
.reviews-header h2,
.variant-header h2,
.related-products-header h2 {
  color: var(--color-heading);
}

.detail-copy h1,
.not-found-card h1 {
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  line-height: 1;
  font-weight: 800;
}

.reviews-header h2,
.variant-header h2,
.related-products-header h2 {
  margin-top: 0.35rem;
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 800;
}

.price {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-heading);
}

.description,
.not-found-card p,
.reviews-header p,
.signin-copy,
.review-empty-state p,
.review-content,
.review-meta p,
.selection-message,
.section-empty-state p {
  color: var(--color-text-soft);
  font-size: 1rem;
}

.variant-card {
  padding: 1.25rem;
  display: grid;
  gap: 1rem;
}

.variant-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: start;
}

.availability-chip {
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: rgba(245, 158, 11, 0.14);
  color: #92400e;
  font-weight: 700;
  white-space: nowrap;
}

.availability-chip.ready {
  background: rgba(34, 197, 94, 0.16);
  color: #166534;
}

.variant-groups {
  display: grid;
  gap: 1rem;
}

.variant-group {
  display: grid;
  gap: 0.7rem;
}

.group-heading {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: var(--color-heading);
}

.group-heading span {
  color: var(--color-text-soft);
}

.variant-values {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.variant-value {
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-heading);
  padding: 0.7rem 0.95rem;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
}

.variant-value.selected {
  border-color: rgba(15, 118, 110, 0.32);
  background: rgba(15, 118, 110, 0.12);
  color: var(--color-accent);
}

.variant-value:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.selection-message.invalid {
  color: #b45309;
}

.selection-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.selection-summary li {
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.88);
  color: var(--color-heading);
  font-weight: 600;
}

.detail-actions,
.not-found-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  margin-top: 0.35rem;
}

.icon-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.primary-action,
.secondary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0.95rem 1.2rem;
  border-radius: 999px;
  font-weight: 700;
  text-decoration: none;
}

.primary-action {
  border: 1px solid rgba(15, 118, 110, 0.24);
  background: linear-gradient(135deg, #0f766e, #115e59);
  box-shadow: 0 1rem 2rem rgba(15, 118, 110, 0.18);
  color: #f7fbfc;
  cursor: pointer;
}

.primary-action:disabled {
  opacity: 0.6;
  box-shadow: none;
  filter: grayscale(0.15);
  cursor: not-allowed;
}

.secondary-action {
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid var(--color-border);
  color: var(--color-heading);
}

.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.4rem;
  height: 3.4rem;
  padding: 0;
  border-radius: 999px;
  cursor: pointer;
}

.wishlist-button {
  border: 1px solid var(--color-border);
  background: #fff;
  color: #111827;
}

.wishlist-button.active {
  color: #dc2626;
}

.icon-button svg {
  width: 1.3rem;
  height: 1.3rem;
}

.related-products-shell {
  display: grid;
  gap: 1.25rem;
  padding: 1.5rem;
}

.related-products-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

.related-product-card {
  display: grid;
  border: 1px solid var(--color-border);
  border-radius: 24px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.82);
}

.related-product-image-link {
  display: block;
  aspect-ratio: 1.1;
  overflow: hidden;
}

.related-product-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.related-product-copy {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
}

.related-product-category {
  color: var(--color-accent);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.related-product-title-link {
  color: inherit;
}

.related-product-title-link h3 {
  color: var(--color-heading);
  font-size: 1.1rem;
  font-weight: 700;
}

.related-product-description {
  color: var(--color-text-soft);
  min-height: 4.5rem;
}

.related-product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.related-product-footer strong {
  color: var(--color-heading);
}

.related-product-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 0.95rem;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.08);
  color: var(--color-accent);
  font-weight: 700;
}

.reviews-shell {
  display: grid;
  gap: 1.25rem;
  padding: 1.5rem;
}

.reviews-header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 1rem;
}

.review-count {
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.08);
  color: var(--color-accent);
  font-weight: 700;
}

.reviews-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
}

.review-form-card,
.review-list-card {
  padding: 1.5rem;
}

.review-form,
.review-list {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.review-form label {
  display: grid;
  gap: 0.45rem;
  color: var(--color-heading);
  font-weight: 600;
}

.sign-in-link {
  margin-top: 1rem;
}

:deep(.review-form .ant-rate) {
  color: #f59e0b;
}

:deep(.review-form .ant-input-textarea textarea) {
  border-radius: 18px;
  border-color: var(--color-border);
  color: var(--color-heading);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: none;
}

:deep(.review-meta .ant-rate) {
  color: #f59e0b;
  font-size: 0.95rem;
}

.review-empty-state,
.section-empty-state {
  display: grid;
  gap: 0.75rem;
  justify-items: start;
  padding: 1.5rem;
  border: 1px dashed rgba(15, 118, 110, 0.18);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.7);
}

.review-empty-state h3,
.review-meta strong,
.section-empty-state h3 {
  color: var(--color-heading);
}

.review-empty-state h3,
.section-empty-state h3 {
  font-size: 1.35rem;
  font-weight: 800;
}

.review-item {
  display: grid;
  gap: 0.8rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.review-item:first-child {
  padding-top: 0;
  border-top: 0;
}

.review-meta {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 1rem;
}

.not-found-card {
  display: grid;
  gap: 0.9rem;
  justify-items: start;
  padding: 2rem;
}

.skeleton-detail-shell {
  background: rgba(255, 255, 255, 0.88);
}

.skeleton-detail-media,
.skeleton-line,
.skeleton-pill,
.skeleton-button,
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

.skeleton-detail-media {
  min-height: 24rem;
  border-radius: 22px;
}

.skeleton-line {
  height: 0.9rem;
  border-radius: 999px;
}

.skeleton-line-short {
  width: 26%;
}

.skeleton-line-medium {
  width: 56%;
}

.skeleton-line-title {
  width: 72%;
  height: 1.4rem;
}

.skeleton-pill-row,
.skeleton-action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.35rem;
}

.skeleton-pill {
  width: 6.5rem;
  height: 2.6rem;
  border-radius: 999px;
}

.skeleton-button {
  width: 11rem;
  height: 3rem;
  border-radius: 999px;
}

.skeleton-icon {
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 999px;
}

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
}

@media (max-width: 960px) {
  .detail-shell,
  .related-products-grid,
  .reviews-layout {
    grid-template-columns: 1fr;
  }

  .detail-media img,
  .skeleton-detail-media {
    min-height: 18rem;
  }

  .detail-actions,
  .reviews-header,
  .review-meta,
  .variant-header,
  .group-heading,
  .related-product-footer {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { findProductById, parseProductId } from '@/data/products'
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

const { itemCount } = storeToRefs(cartStore)
const { profile } = storeToRefs(profileStore)

const reviewForm = reactive({
  rating: 5,
  content: '',
})

const currencyFormatter = new Intl.NumberFormat('zh-TW', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const productId = computed(() => parseProductId(route.params.productId))
const product = computed(() =>
  productId.value === null ? null : (findProductById(productId.value) ?? null),
)

const isFavorited = computed(() =>
  product.value ? wishlistStore.isFavorited(product.value.id) : false,
)

const productReviews = computed(() =>
  product.value ? reviewStore.getReviewsForProduct(product.value.id) : [],
)

const existingUserReview = computed(() => null)

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
  product,
  (nextProduct) => {
    if (!nextProduct) {
      return
    }

    recentlyViewedStore.recordProductView(nextProduct.id)
  },
  { immediate: true },
)

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

function addToCart(nextProductId: number, productName: string) {
  cartStore.addItem(nextProductId)
  uiStore.showSuccessToast(`${productName} 已加入購物車。`, '已加入購物車')
}

function toggleFavorite(nextProductId: number) {
  if (!authStore.isAuthenticated) {
    uiStore.showWarningToast('登入後才能使用收藏功能，請先登入會員帳號。')
    void router.push('/login')
    return
  }

  wishlistStore.toggleFavorite(nextProductId)
}

function submitReview() {
  if (!product.value) {
    return
  }

  if (!authStore.isAuthenticated) {
    uiStore.showWarningToast('登入後才能提交商品評論，請先登入會員帳號。')
    void router.push('/login')
    return
  }

  if (!isReviewFormValid.value) {
    uiStore.showWarningToast('請填寫 1 到 5 分評分，並輸入有效的評論內容。', '評論內容未完成')
    return
  }

  reviewStore.upsertReview({
    productId: product.value.id,
    authorName: profile.value.name,
    authorEmail: profile.value.email,
    rating: reviewForm.rating,
    content: reviewForm.content,
  })
  reviewForm.rating = 5
  reviewForm.content = ''

  uiStore.showSuccessToast(
    existingUserReview.value ? '你的評論已更新。' : '你的評論已送出。',
    existingUserReview.value ? '評論已更新' : '評論已送出',
  )
}
</script>

<template>
  <main class="product-detail-page">
    <section v-if="product" class="detail-shell">
      <div class="detail-media">
        <img :src="product.image" :alt="product.name" />
      </div>

      <div class="detail-copy">
        <RouterLink to="/" class="back-link">返回商品頁</RouterLink>
        <p class="eyebrow">{{ product.category }}</p>
        <h1>{{ product.name }}</h1>
        <p class="price">{{ formatCurrency(product.price) }}</p>
        <p class="description">{{ product.description }}</p>

        <div class="detail-actions">
          <RouterLink to="/cart" class="secondary-action">
            前往購物車<span class="action-badge">{{ itemCount }}</span>
          </RouterLink>

          <div class="icon-actions">
            <button
              type="button"
              class="icon-button wishlist-button"
              :class="{ active: isFavorited }"
              :aria-label="isFavorited ? `取消收藏 ${product.name}` : `收藏 ${product.name}`"
              @click="toggleFavorite(product.id)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 20.25 4.8 13.41a4.52 4.52 0 0 1 0-6.48 4.73 4.73 0 0 1 6.6 0L12 7.51l.6-.58a4.73 4.73 0 0 1 6.6 0 4.52 4.52 0 0 1 0 6.48Z"
                  :fill="isFavorited ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                />
              </svg>
            </button>

            <button
              type="button"
              class="icon-button cart-button"
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
      </div>
    </section>

    <section v-if="product" class="reviews-shell">
      <div class="reviews-header">
        <div>
          <p class="eyebrow">Reviews</p>
          <h2>商品評論</h2>
          <p>看看其他會員對這項商品的看法，或留下你自己的使用心得。</p>
        </div>
        <span class="review-count">{{ productReviews.length }} 則評論</span>
      </div>

      <div class="reviews-layout">
        <section class="review-form-card">
          <template v-if="authStore.isAuthenticated">
            <p class="section-label">
              {{ existingUserReview ? '更新你的評論' : '撰寫評論' }}
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
                  placeholder="分享你對這項商品的看法與使用感受"
                />
              </label>

              <button type="submit" class="primary-action" :disabled="!isReviewFormValid">
                {{ existingUserReview ? '更新評論' : '送出評論' }}
              </button>
            </form>
          </template>

          <template v-else>
            <p class="section-label">登入後可提交評論</p>
            <p class="signin-copy">你目前可以查看評論內容，登入後才能為這項商品留下評分與評論。</p>
            <RouterLink to="/login" class="secondary-action sign-in-link">前往登入</RouterLink>
          </template>
        </section>

        <section class="review-list-card">
          <p class="section-label">最新評論</p>

          <div v-if="productReviews.length === 0" class="review-empty-state">
            <h3>目前還沒有評論</h3>
            <p>成為第一位留下評分與評論的人，幫助其他使用者更快了解這項商品。</p>
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

    <section v-else class="not-found-card">
      <p class="eyebrow">找不到商品</p>
      <h1>這個商品可能不存在</h1>
      <p>你可以返回商品頁重新挑選，或前往購物車查看目前已加入的商品。</p>

      <div class="not-found-actions">
        <RouterLink to="/" class="primary-action">返回商品頁</RouterLink>
        <RouterLink to="/cart" class="secondary-action">前往購物車</RouterLink>
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
.not-found-card,
.review-form-card,
.review-list-card {
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
.reviews-header h2 {
  color: var(--color-heading);
}

.detail-copy h1,
.not-found-card h1 {
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  line-height: 1;
  font-weight: 800;
}

.reviews-header h2 {
  margin-top: 0.35rem;
  font-size: clamp(1.7rem, 4vw, 2.4rem);
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
.review-meta p {
  color: var(--color-text-soft);
  font-size: 1rem;
}

.detail-actions,
.not-found-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  margin-top: 1rem;
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

.cart-button {
  border: 1px solid rgba(34, 197, 94, 0.24);
  background: #22c55e;
  color: #f7fbfc;
  box-shadow: 0 0.75rem 1.5rem rgba(34, 197, 94, 0.24);
}

.icon-button svg {
  width: 1.3rem;
  height: 1.3rem;
}

.action-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.4rem;
  height: 1.4rem;
  padding: 0 0.3rem;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.12);
  color: var(--color-accent);
  font-size: 0.78rem;
  font-weight: 800;
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

.review-form-card .section-label,
.review-list-card .section-label {
  white-space: nowrap;
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

.review-empty-state {
  margin-top: 1rem;
}

.review-empty-state h3,
.review-meta strong {
  color: var(--color-heading);
}

.review-empty-state h3 {
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

@media (max-width: 960px) {
  .detail-shell,
  .reviews-layout {
    grid-template-columns: 1fr;
  }

  .detail-media img {
    min-height: 18rem;
  }

  .detail-actions,
  .reviews-header,
  .review-meta {
    align-items: stretch;
  }
}
</style>

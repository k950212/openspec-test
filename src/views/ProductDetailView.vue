<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

import {
  findMatchingVariantCombination,
  findProductById,
  getProductGallery,
  getProductVariantSelectionSummary,
  getRelatedProducts,
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

const SWIPE_THRESHOLD = 42

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
const isDetailLoading = ref(true)
const activeImageIndex = ref(0)
const isPreviewOpen = ref(false)
const failedImages = ref<string[]>([])

const touchState = reactive({
  startX: 0,
  endX: 0,
})

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
const relatedProducts = computed(() => (product.value ? getRelatedProducts(product.value.id, 4) : []))
const productReviews = computed(() =>
  product.value ? reviewStore.getReviewsForProduct(product.value.id) : [],
)
const productGallery = computed(() =>
  product.value ? getProductGallery(product.value, variantSelection) : [],
)
const gallerySignature = computed(() => productGallery.value.join('||'))
const hasMultipleImages = computed(() => productGallery.value.length > 1)
const activeImage = computed(() => productGallery.value[activeImageIndex.value] ?? '')
const hasActiveVariantImageSet = computed(() => {
  if (!product.value) {
    return false
  }

  return (findMatchingVariantCombination(product.value, variantSelection)?.gallery?.length ?? 0) > 0
})
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
      message: '請先完成所有規格選擇，再加入購物車。',
      summary: getProductVariantSelectionSummary(product.value, variantSelection),
    }
  }

  const matchingCombination = findMatchingVariantCombination(product.value, variantSelection)

  if (!matchingCombination) {
    return {
      isComplete: true,
      isValid: false,
      message: '目前選擇的規格組合不可購買，請改選其他搭配。',
      summary: getProductVariantSelectionSummary(product.value, variantSelection),
    }
  }

  return {
    isComplete: true,
    isValid: true,
    message: hasActiveVariantImageSet.value
      ? '目前規格可加入購物車，圖片也已切換為對應款式。'
      : '目前規格可加入購物車。',
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

    activeImageIndex.value = 0
    isPreviewOpen.value = false
    failedImages.value = []

    if (!nextProduct) {
      return
    }

    recentlyViewedStore.recordProductView(nextProduct.id)
  },
  { immediate: true },
)

watch(
  gallerySignature,
  () => {
    activeImageIndex.value = 0
    isPreviewOpen.value = false
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

function isFavorited(nextProductId: number) {
  return wishlistStore.isFavorited(nextProductId)
}

function toggleFavorite(nextProductId: number) {
  if (!authStore.isAuthenticated) {
    uiStore.showWarningToast('請先登入後再管理收藏。')
    void router.push('/login')
    return
  }

  const added = wishlistStore.toggleFavorite(nextProductId)
  uiStore.showSuccessToast(
    added ? '商品已加入收藏。' : '商品已從收藏中移除。',
    added ? '收藏成功' : '已取消收藏',
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
    uiStore.showWarningToast(selectionState.value.message, '無法加入購物車')
    return
  }

  uiStore.showSuccessToast(`${product.value.name} 已加入購物車。`, '加入成功')
}

function submitReview() {
  if (!product.value) {
    return
  }

  if (!authStore.isAuthenticated) {
    uiStore.showWarningToast('請先登入後再撰寫評論。')
    void router.push('/login')
    return
  }

  if (!isReviewFormValid.value) {
    uiStore.showWarningToast('請填寫 1 到 5 星評分，並輸入評論內容。', '評論資料未完成')
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
  uiStore.showSuccessToast('你的評論已成功送出。', '評論完成')
}

function setActiveImage(index: number) {
  if (index < 0 || index >= productGallery.value.length) {
    return
  }

  activeImageIndex.value = index
}

function previewImage(index: number) {
  if (!supportsHoverPreview()) {
    return
  }

  setActiveImage(index)
}

function supportsHoverPreview() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }

  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

function openPreviewModal() {
  if (!activeImage.value) {
    return
  }

  isPreviewOpen.value = true
}

function closePreviewModal() {
  isPreviewOpen.value = false
}

function showPreviousImage() {
  if (!hasMultipleImages.value) {
    return
  }

  activeImageIndex.value =
    activeImageIndex.value === 0 ? productGallery.value.length - 1 : activeImageIndex.value - 1
}

function showNextImage() {
  if (!hasMultipleImages.value) {
    return
  }

  activeImageIndex.value =
    activeImageIndex.value === productGallery.value.length - 1 ? 0 : activeImageIndex.value + 1
}

function handleTouchStart(event: TouchEvent) {
  if (!hasMultipleImages.value) {
    return
  }

  touchState.startX = event.touches[0]?.clientX ?? 0
  touchState.endX = touchState.startX
}

function handleTouchMove(event: TouchEvent) {
  if (!hasMultipleImages.value) {
    return
  }

  touchState.endX = event.touches[0]?.clientX ?? touchState.startX
}

function handleTouchEnd() {
  if (!hasMultipleImages.value) {
    return
  }

  const distance = touchState.endX - touchState.startX

  if (Math.abs(distance) < SWIPE_THRESHOLD) {
    return
  }

  if (distance < 0) {
    showNextImage()
    return
  }

  showPreviousImage()
}

function markImageFailed(imageUrl: string) {
  if (failedImages.value.includes(imageUrl)) {
    return
  }

  failedImages.value = [...failedImages.value, imageUrl]
}

function isImageFailed(imageUrl: string) {
  return failedImages.value.includes(imageUrl)
}
</script>

<template>
  <main class="product-detail-page">
    <template v-if="isDetailLoading">
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
      <div class="gallery-panel">
        <div
          class="detail-media"
          @touchstart.passive="handleTouchStart"
          @touchmove.passive="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <button type="button" class="main-image-button" @click="openPreviewModal">
            <div v-if="activeImage && !isImageFailed(activeImage)" class="detail-image-frame">
              <img :src="activeImage" :alt="product.name" @error="markImageFailed(activeImage)" />
            </div>

            <div v-else class="detail-image-fallback">
              <strong>圖片載入中斷</strong>
              <p>你仍可透過下方縮圖切換其他商品圖片。</p>
            </div>

          </button>

          <div v-if="hasMultipleImages" class="swipe-hint">可左右滑動瀏覽更多圖片</div>
        </div>

        <div v-if="hasMultipleImages" class="thumbnail-rail" role="list" aria-label="商品圖片縮圖">
          <button
            v-for="(image, index) in productGallery"
            :key="`${product.id}-${image}-${index}`"
            type="button"
            class="thumbnail-button"
            :class="{ active: activeImageIndex === index }"
            :aria-pressed="activeImageIndex === index"
            @mouseenter="previewImage(index)"
            @focus="setActiveImage(index)"
            @click="setActiveImage(index)"
          >
            <img
              v-if="!isImageFailed(image)"
              :src="image"
              :alt="`${product.name} 縮圖 ${index + 1}`"
              @error="markImageFailed(image)"
            />
            <span v-else class="thumbnail-fallback">圖片 {{ index + 1 }}</span>
          </button>
        </div>
      </div>

      <div class="detail-copy">
        <RouterLink to="/" class="back-link">返回商品列表</RouterLink>
        <p class="eyebrow">{{ product.category }}</p>
        <h1>{{ product.name }}</h1>
        <p class="price">{{ formatCurrency(product.price) }}</p>
        <p class="description">{{ product.description }}</p>

        <section v-if="variantOptionGroups.length > 0" class="variant-card">
          <div class="variant-header">
            <div>
              <p class="section-label">商品規格</p>
              <h2>先選好想要的款式</h2>
            </div>
            <span
              class="availability-chip"
              :class="{ ready: selectionState.isValid && selectionState.isComplete }"
            >
              {{ selectionState.isValid && selectionState.isComplete ? '可加入購物車' : '尚未完成選擇' }}
            </span>
          </div>

          <div class="variant-groups">
            <div v-for="group in variantOptionGroups" :key="group.id" class="variant-group">
              <div class="group-heading">
                <strong>{{ group.label }}</strong>
                <span>{{ variantSelection[group.id] ?? '尚未選擇' }}</span>
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

    <section v-if="!isDetailLoading && product" class="related-products-shell">
      <div class="related-products-header">
        <div>
          <p class="eyebrow">相關商品</p>
          <h2>你可能也會喜歡</h2>
          <p>同分類中的其他商品也許會更適合你的空間與使用情境。</p>
        </div>
      </div>

      <div v-if="relatedProducts.length > 0" class="related-products-grid">
        <article
          v-for="relatedProduct in relatedProducts"
          :key="relatedProduct.id"
          class="related-product-card"
        >
          <RouterLink :to="`/products/${relatedProduct.id}`" class="related-product-image-link">
            <span
              v-if="relatedProduct.saleBadge"
              class="sale-badge"
              :class="`sale-badge-${relatedProduct.saleBadge.variant ?? 'sale'}`"
            >
              {{ relatedProduct.saleBadge.label }}
            </span>
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
        <p>這個分類中的可推薦商品暫時不足，你可以回到首頁繼續探索其他選擇。</p>
        <RouterLink to="/" class="secondary-action">回到商店首頁</RouterLink>
      </div>
    </section>

    <section v-if="!isDetailLoading && product" class="reviews-shell">
      <div class="reviews-header">
        <div>
          <p class="eyebrow">評論</p>
          <h2>看看其他人的使用心得</h2>
          <p>登入後可以留下你的實際使用感受，幫助下一位購買者更快做決定。</p>
        </div>
        <span class="review-count">{{ productReviews.length }} 則評論</span>
      </div>

      <div class="reviews-layout">
        <section class="review-form-card">
          <template v-if="authStore.isAuthenticated">
            <p class="section-label">
              {{ existingUserReview ? '你已提交過評論' : '新增評論' }}
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
                  placeholder="分享你對這項商品的材質、尺寸或實際使用感受。"
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
            <p>你可以成為第一位留下心得的人，幫助其他人更了解這項商品。</p>
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

    <section v-else-if="!isDetailLoading" class="not-found-card">
      <p class="eyebrow">找不到商品</p>
      <h1>目前找不到這項商品。</h1>
      <p>這個連結可能已失效，或商品已從目前的商店清單中移除。</p>

      <div class="not-found-actions">
        <RouterLink to="/" class="primary-action">返回商品首頁</RouterLink>
        <RouterLink to="/cart" class="secondary-action">前往購物車</RouterLink>
      </div>
    </section>

    <teleport to="body">
      <div v-if="isPreviewOpen && product" class="preview-modal" @click.self="closePreviewModal">
        <div class="preview-dialog" role="dialog" aria-modal="true" :aria-label="`${product.name} 圖片預覽`">
          <button type="button" class="preview-close" @click="closePreviewModal">關閉</button>

          <div class="preview-stage">
            <button
              v-if="hasMultipleImages"
              type="button"
              class="preview-nav"
              aria-label="查看上一張圖片"
              @click="showPreviousImage"
            >
              ‹
            </button>

            <div v-if="activeImage && !isImageFailed(activeImage)" class="preview-image-frame">
              <img :src="activeImage" :alt="product.name" @error="markImageFailed(activeImage)" />
            </div>

            <div v-else class="preview-image-fallback">
              <strong>目前無法顯示這張圖片</strong>
              <p>你可以切換到其他縮圖繼續瀏覽。</p>
            </div>

            <button
              v-if="hasMultipleImages"
              type="button"
              class="preview-nav"
              aria-label="查看下一張圖片"
              @click="showNextImage"
            >
              ›
            </button>
          </div>

          <div v-if="hasMultipleImages" class="preview-thumbnail-rail">
            <button
              v-for="(image, index) in productGallery"
              :key="`${product.id}-preview-${image}-${index}`"
              type="button"
              class="preview-thumbnail"
              :class="{ active: activeImageIndex === index }"
              @click="setActiveImage(index)"
            >
              <img
                v-if="!isImageFailed(image)"
                :src="image"
                :alt="`${product.name} 預覽縮圖 ${index + 1}`"
                @error="markImageFailed(image)"
              />
              <span v-else>圖片 {{ index + 1 }}</span>
            </button>
          </div>
        </div>
      </div>
    </teleport>
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
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 1fr);
  gap: 1.5rem;
  padding: 1.5rem;
}

.gallery-panel {
  display: grid;
  gap: 1rem;
  min-width: 0;
}

.detail-media {
  display: grid;
  gap: 0.75rem;
}

.main-image-button {
  position: relative;
  display: block;
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: zoom-in;
}

.detail-image-frame,
.detail-image-fallback,
.preview-image-frame,
.preview-image-fallback {
  min-height: 24rem;
  border-radius: 22px;
  overflow: hidden;
  background: rgba(241, 245, 249, 0.9);
}

.detail-image-frame img,
.preview-image-frame img {
  width: 100%;
  height: 100%;
  min-height: 24rem;
  object-fit: cover;
  display: block;
}

.detail-image-fallback,
.preview-image-fallback {
  display: grid;
  place-items: center;
  gap: 0.5rem;
  padding: 2rem;
  text-align: center;
  color: var(--color-text-soft);
  border: 1px dashed rgba(15, 118, 110, 0.18);
}

.detail-image-fallback strong,
.preview-image-fallback strong {
  color: var(--color-heading);
}

.swipe-hint {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 0.5rem 0.85rem;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.08);
  color: var(--color-accent);
  font-size: 0.82rem;
  font-weight: 700;
}

.swipe-hint {
  display: none;
}

.swipe-hint {
  justify-self: start;
}

.thumbnail-rail,
.preview-thumbnail-rail {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(5.5rem, 6.8rem);
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.thumbnail-button,
.preview-thumbnail {
  display: grid;
  place-items: center;
  overflow: hidden;
  aspect-ratio: 1;
  border-radius: 20px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.92);
  cursor: pointer;
}

.thumbnail-button.active,
.preview-thumbnail.active {
  border-color: rgba(15, 118, 110, 0.38);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
}

.thumbnail-button img,
.preview-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumbnail-fallback {
  padding: 0.6rem;
  color: var(--color-text-soft);
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
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
  background: var(--color-surface);
  color: var(--color-heading);
  padding: 0.7rem 0.95rem;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.variant-value:hover:not(:disabled) {
  border-color: var(--color-border-hover);
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
  position: relative;
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
  min-height: 3rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

.preview-modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: start center;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(10px);
  overflow-y: auto;
}

.preview-dialog {
  width: min(100%, 72rem);
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 2rem 4rem rgba(15, 23, 42, 0.26);
  margin: auto 0;
}

.preview-close {
  justify-self: end;
  border: 0;
  border-radius: 999px;
  padding: 0.7rem 1rem;
  background: rgba(15, 118, 110, 0.08);
  color: var(--color-accent);
  font-weight: 700;
  cursor: pointer;
}

.preview-stage {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 1rem;
}

.preview-nav {
  width: 3.4rem;
  height: 3.4rem;
  border: 0;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.08);
  color: var(--color-accent);
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
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

@media (max-width: 1100px) {
  .related-products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 960px) {
  .detail-shell,
  .reviews-layout {
    grid-template-columns: 1fr;
  }

  .detail-image-frame,
  .detail-image-frame img,
  .detail-image-fallback,
  .preview-image-frame,
  .preview-image-frame img,
  .preview-image-fallback,
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

  .preview-dialog {
    width: min(100%, 42rem);
  }

  .preview-stage {
    grid-template-columns: 1fr;
  }

  .preview-nav {
    justify-self: center;
  }
}

@media (max-width: 700px) {
  .product-detail-page {
    gap: 1rem;
  }

  .swipe-hint {
    display: inline-flex;
  }

  .related-products-grid {
    grid-template-columns: 1fr;
  }

  .thumbnail-rail,
  .preview-thumbnail-rail {
    grid-auto-columns: minmax(4.8rem, 5.6rem);
  }

  .preview-modal {
    padding: 0.75rem;
  }

  .preview-dialog {
    margin: 0;
  }
}
</style>

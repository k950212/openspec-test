<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'

import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'

const cartStore = useCartStore()
const uiStore = useUiStore()
const {
  detailedItems,
  subtotal,
  shipping,
  shippingBase,
  couponInput,
  appliedCoupon,
  couponDiscount,
  couponFeedback,
  total,
  hasActiveCoupon,
} = storeToRefs(cartStore)

const isCartLoading = ref(true)
const skeletonItems = [0, 1]

let cartLoadTimer: number | undefined

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const couponFeedbackClass = computed(() => ({
  success: couponFeedback.value.type === 'success',
  error: couponFeedback.value.type === 'error',
  info: couponFeedback.value.type === 'info',
}))

onMounted(() => {
  startCartLoading()
})

onBeforeUnmount(() => {
  if (cartLoadTimer !== undefined) {
    window.clearTimeout(cartLoadTimer)
  }
})

function startCartLoading() {
  isCartLoading.value = true

  if (cartLoadTimer !== undefined) {
    window.clearTimeout(cartLoadTimer)
  }

  cartLoadTimer = window.setTimeout(() => {
    isCartLoading.value = false
  }, 220)
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

function removeFromCart(itemKey: string, productName: string) {
  cartStore.removeItem(itemKey)
  uiStore.showRemovalToast(`${productName} 已從購物車移除。`)
}

function decrementItem(itemKey: string, productName: string, quantity: number) {
  cartStore.decrementItem(itemKey)

  if (quantity === 1) {
    uiStore.showRemovalToast(`${productName} 已從購物車移除。`)
  }
}

function applyCoupon() {
  const applied = cartStore.applyCoupon()

  if (applied && appliedCoupon.value) {
    uiStore.showSuccessToast(`已套用 ${appliedCoupon.value.code}。`, '優惠已啟用')
  }
}

function removeCoupon() {
  cartStore.removeCoupon()
}
</script>

<template>
  <main class="cart-page">
    <section class="cart-panel">
      <div class="section-heading">
        <p class="eyebrow">購物車</p>
        <h1>整理你目前已選擇的商品</h1>
        <p>在這裡確認數量、規格、coupon 與總計，準備好後就可以前往結帳。</p>
      </div>

      <template v-if="isCartLoading">
        <div class="cart-layout">
          <section class="cart-list">
            <article v-for="item in skeletonItems" :key="item" class="cart-item skeleton-card">
              <div class="skeleton-media"></div>
              <div class="item-copy">
                <div class="skeleton-line skeleton-line-short"></div>
                <div class="skeleton-line skeleton-line-title"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line skeleton-line-medium"></div>
              </div>
              <div class="item-controls">
                <div class="skeleton-pill"></div>
                <div class="skeleton-line skeleton-line-medium"></div>
                <div class="skeleton-line skeleton-line-short"></div>
              </div>
            </article>
          </section>

          <aside class="summary-card skeleton-summary">
            <div class="skeleton-line skeleton-line-title"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line skeleton-line-medium"></div>
            <div class="skeleton-button"></div>
            <div class="skeleton-button skeleton-button-secondary"></div>
          </aside>
        </div>
      </template>

      <div v-else-if="detailedItems.length === 0" class="empty-state">
        <h2>購物車目前沒有商品</h2>
        <p>先回到商店首頁逛逛，把喜歡的商品加入購物車後再回來確認。</p>
        <RouterLink to="/" class="link-button">返回商店首頁</RouterLink>
      </div>

      <div v-else class="cart-layout">
        <section class="cart-list">
          <article v-for="item in detailedItems" :key="item.itemKey" class="cart-item">
            <img :src="item.product.image" :alt="item.product.name" />
            <div class="item-copy">
              <p class="item-category">{{ item.product.category }}</p>
              <h2>{{ item.product.name }}</h2>
              <p>{{ item.product.description }}</p>
              <ul v-if="item.variantSummary.length > 0" class="variant-summary">
                <li v-for="summary in item.variantSummary" :key="summary">{{ summary }}</li>
              </ul>
              <p class="item-price">{{ formatCurrency(item.product.price) }}</p>
            </div>

            <div class="item-controls">
              <div class="quantity-control">
                <button
                  type="button"
                  @click="decrementItem(item.itemKey, item.product.name, item.quantity)"
                >
                  -
                </button>
                <span>{{ item.quantity }}</span>
                <button type="button" @click="cartStore.incrementItem(item.itemKey)">+</button>
              </div>

              <p class="line-total">{{ formatCurrency(item.lineTotal) }}</p>
              <button
                type="button"
                class="remove-button"
                @click="removeFromCart(item.itemKey, item.product.name)"
              >
                移除
              </button>
            </div>
          </article>
        </section>

        <aside class="summary-card">
          <h2>訂單摘要</h2>

          <section class="coupon-card">
            <div class="coupon-header">
              <div>
                <p class="coupon-label">Coupon</p>
                <strong>輸入優惠代碼</strong>
              </div>
              <span class="coupon-hint">滿 $100 可套用免運</span>
            </div>

            <div class="coupon-row">
              <a-input
                :value="couponInput"
                size="large"
                placeholder="例如 FREESHIP100"
                class="coupon-input"
                @update:value="cartStore.setCouponInput"
              />
              <a-button type="primary" size="large" class="apply-button" @click="applyCoupon">
                套用
              </a-button>
            </div>

            <p v-if="couponFeedback.message" class="coupon-feedback" :class="couponFeedbackClass">
              {{ couponFeedback.message }}
            </p>

            <div v-if="appliedCoupon" class="applied-coupon">
              <div>
                <span class="applied-pill">{{ appliedCoupon.code }}</span>
                <p>{{ appliedCoupon.label }}</p>
              </div>
              <button type="button" class="remove-coupon-button" @click="removeCoupon">
                移除 coupon
              </button>
            </div>
          </section>

          <dl>
            <div>
              <dt>商品小計</dt>
              <dd>{{ formatCurrency(subtotal) }}</dd>
            </div>
            <div>
              <dt>原始運費</dt>
              <dd>{{ formatCurrency(shippingBase) }}</dd>
            </div>
            <div v-if="hasActiveCoupon" class="discount-row">
              <dt>運費折扣</dt>
              <dd>-{{ formatCurrency(couponDiscount) }}</dd>
            </div>
            <div>
              <dt>實際運費</dt>
              <dd>{{ formatCurrency(shipping) }}</dd>
            </div>
            <div class="summary-total">
              <dt>總計</dt>
              <dd>{{ formatCurrency(total) }}</dd>
            </div>
          </dl>

          <RouterLink to="/checkout" class="primary-link">前往結帳</RouterLink>
          <RouterLink to="/" class="secondary-link">繼續購物</RouterLink>
        </aside>
      </div>
    </section>
  </main>
</template>

<style scoped>
.cart-page {
  padding: 2rem 0 4rem;
}

.cart-panel {
  display: grid;
  gap: 2rem;
}

.section-heading h1 {
  margin-top: 0.4rem;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.05;
  font-weight: 800;
}

.section-heading p:last-child {
  margin-top: 0.75rem;
  max-width: 42rem;
  color: var(--color-text-soft);
}

.eyebrow {
  color: var(--color-accent);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 700;
}

.empty-state,
.summary-card,
.cart-item,
.coupon-card {
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.empty-state {
  padding: 2rem;
}

.empty-state h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--color-heading);
}

.empty-state p {
  margin-top: 0.7rem;
  color: var(--color-text-soft);
}

.cart-layout {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(0, 2fr) minmax(18rem, 24rem);
}

.cart-list {
  display: grid;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 7rem minmax(0, 1fr) auto;
  gap: 1rem;
  padding: 1rem;
}

.cart-item img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 18px;
}

.item-category,
.coupon-label {
  color: var(--color-accent);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.item-copy h2 {
  margin-top: 0.3rem;
  font-size: 1.25rem;
  font-weight: 700;
}

.item-copy p {
  margin-top: 0.4rem;
  color: var(--color-text-soft);
}

.variant-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.75rem 0 0;
  padding: 0;
  list-style: none;
}

.variant-summary li {
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.08);
  color: var(--color-heading);
  font-size: 0.9rem;
  font-weight: 600;
}

.item-price,
.line-total {
  color: var(--color-heading) !important;
  font-weight: 700;
}

.item-controls {
  display: grid;
  align-content: space-between;
  justify-items: end;
  gap: 0.75rem;
}

.quantity-control {
  display: inline-grid;
  grid-template-columns: repeat(3, auto);
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem;
  border-radius: 999px;
  background: var(--color-background-mute);
}

.quantity-control button,
.remove-button,
.link-button,
.primary-link,
.secondary-link,
.apply-button,
.remove-coupon-button {
  border: 0;
  cursor: pointer;
  text-decoration: none;
}

.quantity-control button {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: #fff;
  color: var(--color-heading);
}

.remove-button {
  background: transparent;
  color: var(--color-accent);
  padding: 0;
}

.summary-card {
  padding: 1.5rem;
  align-self: start;
  display: grid;
  gap: 1rem;
}

.summary-card h2 {
  font-size: 1.4rem;
  font-weight: 700;
}

.coupon-card {
  padding: 1rem;
  display: grid;
  gap: 0.85rem;
  box-shadow: none;
}

.coupon-header,
.applied-coupon {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.coupon-header strong {
  color: var(--color-heading);
}

.coupon-hint,
.applied-coupon p {
  color: var(--color-text-soft);
  font-size: 0.9rem;
}

.coupon-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
}

.coupon-input {
  width: 100%;
}

.remove-coupon-button {
  border-radius: 999px;
  padding: 0.85rem 1rem;
  font-weight: 700;
}
.apply-button {
  border-radius: 999px;
  font-weight: 700;
}

.apply-button {
  height: 3rem;
  align-items: center;
  text-align: center;
  border-radius: 999px;
  background: linear-gradient(135deg, #0f766e, #115e59);
  border: 1px solid rgba(15, 118, 110, 0.24);
  box-shadow: 0 1rem 2rem rgba(15, 118, 110, 0.18);
}

.remove-coupon-button {
  background: transparent;
  color: var(--color-accent);
  padding-right: 0;
}

.coupon-feedback {
  padding: 0.8rem 0.95rem;
  border-radius: 16px;
  font-size: 0.95rem;
  font-weight: 600;
}

.coupon-feedback.success {
  background: rgba(34, 197, 94, 0.12);
  color: #166534;
}

.coupon-feedback.error {
  background: rgba(248, 113, 113, 0.12);
  color: #b91c1c;
}

.coupon-feedback.info {
  background: rgba(59, 130, 246, 0.12);
  color: #1d4ed8;
}

:deep(.coupon-input .ant-input) {
  min-height: 3rem;
  border-radius: 16px;
  border-color: var(--color-border);
  background: rgba(255, 255, 255, 0.88);
  color: var(--color-heading);
  box-shadow: none;
}

.applied-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.08);
  color: var(--color-accent);
  font-size: 0.85rem;
  font-weight: 700;
}

.summary-card dl {
  display: grid;
  gap: 0.85rem;
}

.summary-card dl div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: var(--color-text-soft);
}

.discount-row {
  color: #166534 !important;
  font-weight: 700;
}

.summary-total {
  margin-top: 0.75rem;
  padding-top: 0.9rem;
  border-top: 1px solid var(--color-border);
  color: var(--color-heading) !important;
  font-weight: 700;
}

.link-button,
.primary-link,
.secondary-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.95rem 1.2rem;
  border-radius: 999px;
  font-weight: 700;
}

.primary-link,
.link-button {
  background: linear-gradient(135deg, #0f766e, #115e59);
  border: 1px solid rgba(15, 118, 110, 0.24);
  box-shadow: 0 1rem 2rem rgba(15, 118, 110, 0.18);
  color: #f7fbfc;
}

.secondary-link {
  background: var(--color-background-mute);
  color: var(--color-heading);
}

.skeleton-card,
.skeleton-summary {
  background: rgba(255, 255, 255, 0.9);
}

.skeleton-media,
.skeleton-line,
.skeleton-pill,
.skeleton-button {
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
  aspect-ratio: 1;
  border-radius: 18px;
}

.skeleton-line {
  height: 0.85rem;
  border-radius: 999px;
}

.skeleton-line-short {
  width: 32%;
}

.skeleton-line-title {
  width: 72%;
  height: 1.2rem;
}

.skeleton-line-medium {
  width: 58%;
}

.skeleton-pill {
  width: 7rem;
  height: 2.5rem;
  border-radius: 999px;
}

.skeleton-button {
  width: 100%;
  height: 3rem;
  border-radius: 999px;
  margin-top: 1rem;
}

.skeleton-button-secondary {
  opacity: 0.7;
}

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
}

@media (max-width: 900px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .cart-item {
    grid-template-columns: 1fr;
  }

  .item-controls,
  .coupon-header,
  .applied-coupon {
    justify-items: start;
    align-items: stretch;
    flex-direction: column;
  }

  .coupon-row {
    grid-template-columns: 1fr;
  }
}
</style>

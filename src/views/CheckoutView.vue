<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'

import { useCartStore } from '@/stores/cart'
import { useOrderStore } from '@/stores/orders'
import { useProfileStore } from '@/stores/profile'

const cartStore = useCartStore()
const orderStore = useOrderStore()
const profileStore = useProfileStore()
const { detailedItems, subtotal, itemCount } = storeToRefs(cartStore)
const { profile } = storeToRefs(profileStore)

const form = reactive({
  fullName: profile.value.name,
  phone: profile.value.phone,
  email: profile.value.email,
  address: profile.value.address,
})

const submittedOrder = ref<{
  customerName: string
  phone: string
  email: string
  address: string
  items: ReturnType<(typeof detailedItems)['value']['slice']>
  subtotal: number
  shipping: number
  total: number
} | null>(null)

const shipping = computed(() => (itemCount.value > 0 ? 12 : 0))
const total = computed(() => subtotal.value + shipping.value)

const canSubmit = computed(
  () =>
    itemCount.value > 0 &&
    form.fullName.trim().length > 0 &&
    form.phone.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.address.trim().length > 0,
)

const currencyFormatter = new Intl.NumberFormat('zh-TW', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

function submitOrder() {
  if (!canSubmit.value) {
    return
  }

  submittedOrder.value = {
    customerName: form.fullName,
    phone: form.phone,
    email: form.email,
    address: form.address,
    items: detailedItems.value.map((item) => ({ ...item })),
    subtotal: subtotal.value,
    shipping: shipping.value,
    total: total.value,
  }

  orderStore.saveOrder({
    customerName: form.fullName,
    phone: form.phone,
    email: form.email,
    address: form.address,
    items: detailedItems.value.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      quantity: item.quantity,
      unitPrice: item.product.price,
      lineTotal: item.lineTotal,
    })),
    subtotal: subtotal.value,
    shipping: shipping.value,
    total: total.value,
  })

  cartStore.clearCart()
}
</script>

<template>
  <main class="checkout-page">
    <section class="checkout-shell">
      <div class="section-heading">
        <p class="eyebrow">Checkout</p>
        <h1>填寫資料並完成訂單</h1>
        <p v-if="!submittedOrder">確認商品內容後，填寫收件資訊並送出訂單。</p>
      </div>

      <section v-if="submittedOrder" class="confirmation-card">
        <p class="confirmation-badge">訂單已送出</p>
        <h2>{{ submittedOrder.customerName }}，感謝你的訂購</h2>
        <p>
          我們將以 {{ submittedOrder.phone }} 與 {{ submittedOrder.email }} 作為聯絡資訊，配送地址為
          {{ submittedOrder.address }}。
        </p>

        <div class="confirmation-summary">
          <article v-for="item in submittedOrder.items" :key="item.productId">
            <span>{{ item.product.name }} x {{ item.quantity }}</span>
            <strong>{{ formatCurrency(item.lineTotal) }}</strong>
          </article>
        </div>

        <p class="confirmation-total">訂單總計：{{ formatCurrency(submittedOrder.total) }}</p>
        <RouterLink to="/" class="primary-link">繼續逛商品</RouterLink>
      </section>

      <div v-else-if="itemCount === 0" class="empty-card">
        <h2>購物車目前是空的</h2>
        <p>先回到商品頁挑選喜歡的商品，之後再回來確認訂單內容。</p>
        <RouterLink to="/" class="primary-link">返回商品頁</RouterLink>
      </div>

      <div v-else class="checkout-layout">
        <form class="checkout-form" @submit.prevent="submitOrder">
          <label>
            姓名
            <a-input v-model:value="form.fullName" placeholder="王小美" size="large" />
          </label>
          <label>
            電話
            <a-input v-model:value="form.phone" placeholder="0912-345-678" size="large" />
          </label>
          <label>
            Email
            <a-input
              v-model:value="form.email"
              type="email"
              placeholder="meimei@example.com"
              size="large"
            />
          </label>
          <label>
            收件地址
            <a-textarea
              v-model:value="form.address"
              :rows="4"
              placeholder="台北市信義區松高路 1 號"
            />
          </label>

          <button type="submit" class="primary-link" :disabled="!canSubmit">送出訂單</button>
        </form>

        <aside class="summary-card">
          <h2>訂單摘要</h2>
          <article v-for="item in detailedItems" :key="item.productId" class="summary-item">
            <div>
              <strong>{{ item.product.name }}</strong>
              <p>數量 {{ item.quantity }}</p>
            </div>
            <span>{{ formatCurrency(item.lineTotal) }}</span>
          </article>

          <dl>
            <div>
              <dt>商品小計</dt>
              <dd>{{ formatCurrency(subtotal) }}</dd>
            </div>
            <div>
              <dt>運費</dt>
              <dd>{{ formatCurrency(shipping) }}</dd>
            </div>
            <div class="summary-total">
              <dt>總計</dt>
              <dd>{{ formatCurrency(total) }}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  </main>
</template>

<style scoped>
.checkout-page {
  padding: 2rem 0 4rem;
}

.checkout-shell {
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
  color: var(--color-text-soft);
}

.eyebrow {
  color: var(--color-accent);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 700;
}

.checkout-layout {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(0, 1.5fr) minmax(18rem, 24rem);
}

.checkout-form,
.summary-card,
.empty-card,
.confirmation-card {
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
  padding: 1.5rem;
}

.checkout-form {
  display: grid;
  gap: 1rem;
  align-content: start;
}

.checkout-form label {
  display: grid;
  gap: 0.45rem;
  color: var(--color-heading);
  font-weight: 600;
}

:deep(.checkout-form .ant-input),
:deep(.checkout-form .ant-input-affix-wrapper),
:deep(.checkout-form .ant-input-textarea textarea) {
  border-radius: 18px;
  border-color: var(--color-border);
  color: var(--color-heading);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: none;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.summary-item p {
  color: var(--color-text-soft);
}

.summary-card dl {
  margin-top: 1rem;
  display: grid;
  gap: 0.85rem;
}

.summary-card dl div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: var(--color-text-soft);
}

.summary-total {
  padding-top: 0.9rem;
  border-top: 1px solid var(--color-border);
  color: var(--color-heading) !important;
  font-weight: 700;
}

.primary-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 3.5rem;
  margin-top: 1rem;
  padding: 0.95rem 1.2rem;
  border: 1px solid rgba(15, 118, 110, 0.24);
  border-radius: 999px;
  background: linear-gradient(135deg, #0f766e, #115e59);
  box-shadow: 0 1rem 2rem rgba(15, 118, 110, 0.18);
  color: #f7fbfc;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}

.primary-link:disabled {
  opacity: 0.6;
  box-shadow: none;
  filter: grayscale(0.15);
  cursor: not-allowed;
}

.checkout-form .primary-link {
  align-self: start;
}

.confirmation-badge {
  display: inline-block;
  margin-bottom: 0.75rem;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.12);
  color: var(--color-accent);
  font-weight: 700;
}

.confirmation-card h2 {
  font-size: 1.8rem;
  font-weight: 800;
}
.empty-card {
  padding: 32px !important;
}
.confirmation-card p,
.empty-card p {
  margin-top: 0.7rem;
  color: var(--color-text-soft);
}

.confirmation-summary {
  margin-top: 1.25rem;
  display: grid;
  gap: 0.75rem;
}

.confirmation-summary article {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.confirmation-total {
  margin-top: 1rem;
  color: var(--color-heading) !important;
  font-size: 1.1rem;
  font-weight: 700;
}

@media (max-width: 900px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }
}
</style>

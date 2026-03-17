<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute } from 'vue-router'

import { useOrderStore } from '@/stores/orders'

const route = useRoute()
const orderStore = useOrderStore()
const { orders } = storeToRefs(orderStore)

const dateFormatter = new Intl.DateTimeFormat('zh-TW', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const currencyFormatter = new Intl.NumberFormat('zh-TW', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const orderId = computed(() => {
  const candidate = route.params.id
  return typeof candidate === 'string' ? candidate : null
})

const order = computed(() => (orderId.value ? orderStore.findOrderById(orderId.value) : null))
const orderCountLabel = computed(() => `目前共有 ${orders.value.length} 筆訂單紀錄`)

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}
</script>

<template>
  <main class="order-detail-page">
    <section v-if="order" class="detail-shell">
      <div class="detail-header">
        <div>
          <p class="eyebrow">Order Detail</p>
          <h1>查看完整訂單內容</h1>
          <p class="heading-copy">{{ orderCountLabel }}</p>
        </div>
        <RouterLink to="/orders" class="back-link">返回訂單紀錄</RouterLink>
      </div>

      <div class="detail-grid">
        <section class="detail-card">
          <p class="section-label">訂單資訊</p>
          <dl class="info-list">
            <div>
              <dt>下單時間</dt>
              <dd>{{ formatDate(order.placedAt) }}</dd>
            </div>
            <div>
              <dt>訂單編號</dt>
              <dd>{{ order.id }}</dd>
            </div>
            <div>
              <dt>姓名</dt>
              <dd>{{ order.customerName }}</dd>
            </div>
            <div>
              <dt>電話</dt>
              <dd>{{ order.phone }}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{{ order.email }}</dd>
            </div>
            <div>
              <dt>地址</dt>
              <dd>{{ order.address }}</dd>
            </div>
          </dl>
        </section>

        <section class="detail-card">
          <p class="section-label">商品清單</p>
          <article
            v-for="item in order.items"
            :key="`${order.id}-${item.productId}`"
            class="order-item"
          >
            <div>
              <strong>{{ item.name }}</strong>
              <p>數量：{{ item.quantity }}</p>
              <p>單價：{{ formatCurrency(item.unitPrice) }}</p>
            </div>
            <span>{{ formatCurrency(item.lineTotal) }}</span>
          </article>

          <dl class="summary-list">
            <div>
              <dt>商品小計</dt>
              <dd>{{ formatCurrency(order.subtotal) }}</dd>
            </div>
            <div>
              <dt>運費</dt>
              <dd>{{ formatCurrency(order.shipping) }}</dd>
            </div>
            <div class="summary-total">
              <dt>總計</dt>
              <dd>{{ formatCurrency(order.total) }}</dd>
            </div>
          </dl>
        </section>
      </div>
    </section>

    <section v-else class="not-found-card">
      <p class="eyebrow">找不到訂單</p>
      <h1>這筆訂單可能不存在</h1>
      <p>你可以返回訂單紀錄頁，重新查看其他已儲存的訂單。</p>
      <RouterLink to="/orders" class="primary-link">返回訂單紀錄</RouterLink>
    </section>
  </main>
</template>

<style scoped>
.order-detail-page {
  padding: 2rem 0 4rem;
}

.detail-shell,
.detail-card,
.not-found-card {
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.72), transparent 34%),
    linear-gradient(135deg, rgba(15, 118, 110, 0.06), rgba(214, 158, 46, 0.06)),
    var(--color-surface);
  box-shadow: var(--shadow-card);
}

.detail-shell {
  display: grid;
  gap: 1.5rem;
  padding: 1.5rem;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: start;
}

.eyebrow,
.section-label {
  color: var(--color-accent);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 700;
}

.detail-header h1,
.not-found-card h1 {
  margin-top: 0.35rem;
  font-size: clamp(2rem, 5vw, 3.3rem);
  line-height: 1.05;
  font-weight: 800;
  color: var(--color-heading);
}

.heading-copy,
.not-found-card p,
.order-item p,
.info-list div {
  color: var(--color-text-soft);
}

.back-link,
.primary-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.05rem;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
}

.back-link {
  background: rgba(15, 118, 110, 0.08);
  color: var(--color-accent);
}

.primary-link {
  background: linear-gradient(135deg, #0f766e, #115e59);
  border: 1px solid rgba(15, 118, 110, 0.24);
  box-shadow: 0 1rem 2rem rgba(15, 118, 110, 0.18);
  color: #f7fbfc;
}

.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 1rem;
}

.detail-card,
.not-found-card {
  padding: 1.5rem;
}

.info-list,
.summary-list {
  margin-top: 1rem;
  display: grid;
  gap: 0.85rem;
}

.info-list div,
.summary-list div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.info-list dt,
.summary-list dt {
  color: var(--color-heading);
  font-weight: 700;
}

.order-item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.95rem 0;
  border-top: 1px solid var(--color-border);
}

.order-item strong,
.summary-total {
  color: var(--color-heading);
}

.summary-total {
  padding-top: 0.85rem;
  border-top: 1px solid var(--color-border);
  font-weight: 700;
}

.not-found-card {
  display: grid;
  gap: 0.9rem;
  justify-items: start;
}

@media (max-width: 860px) {
  .detail-header,
  .detail-grid,
  .info-list div,
  .summary-list div,
  .order-item {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: start;
  }
}
</style>

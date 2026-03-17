<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'

import { useOrderStore } from '@/stores/orders'

const orderStore = useOrderStore()
const { orders, hasOrders } = storeToRefs(orderStore)

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

const orderCountLabel = computed(() => `目前共有 ${orders.value.length} 筆訂單紀錄`)

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}
</script>

<template>
  <main class="order-history-page">
    <section class="history-shell">
      <div class="section-heading">
        <p class="eyebrow">Order History</p>
        <h1>查看你的歷史訂單摘要</h1>
        <p v-if="hasOrders" class="heading-copy">{{ orderCountLabel }}</p>
        <p v-else class="heading-copy">目前還沒有任何歷史訂單。</p>
      </div>

      <section v-if="hasOrders" class="order-list">
        <RouterLink
          v-for="order in orders"
          :key="order.id"
          :to="`/orders/${order.id}`"
          class="order-card"
        >
          <div class="order-main">
            <div>
              <p class="order-label">下單時間</p>
              <h2>{{ formatDate(order.placedAt) }}</h2>
            </div>
            <strong class="order-total">{{ formatCurrency(order.total) }}</strong>
          </div>

          <div class="order-meta">
            <span>{{ order.customerName }}</span>
            <span>{{ order.phone }}</span>
            <span>{{ order.email }}</span>
          </div>

          <span class="detail-hint">查看訂單詳情</span>
        </RouterLink>
      </section>

      <section v-else class="empty-state">
        <h2>還沒有訂單紀錄</h2>
        <p>完成第一筆訂單後，這裡就會顯示你的歷史訂單摘要。</p>
        <RouterLink to="/" class="primary-link">繼續逛商品</RouterLink>
      </section>
    </section>
  </main>
</template>

<style scoped>
.order-history-page {
  padding: 2rem 0 4rem;
}

.history-shell {
  display: grid;
  gap: 1.5rem;
}

.section-heading h1 {
  margin-top: 0.4rem;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.05;
  font-weight: 800;
  color: var(--color-heading);
}

.eyebrow,
.order-label {
  color: var(--color-accent);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 700;
}

.heading-copy {
  margin-top: 0.75rem;
  color: var(--color-text-soft);
}

.order-list {
  display: grid;
  gap: 1rem;
}

.order-card,
.empty-state {
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.72), transparent 34%),
    linear-gradient(135deg, rgba(15, 118, 110, 0.06), rgba(214, 158, 46, 0.06)),
    var(--color-surface);
  box-shadow: var(--shadow-card);
}

.order-card {
  display: grid;
  gap: 0.85rem;
  padding: 1.5rem;
  color: inherit;
  text-decoration: none;
}

.order-main,
.order-meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.order-main {
  align-items: start;
}

.order-main h2 {
  margin-top: 0.25rem;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--color-heading);
}

.order-total {
  color: var(--color-heading);
  font-size: 1.15rem;
  font-weight: 800;
}

.order-meta {
  flex-wrap: wrap;
  color: var(--color-text-soft);
}

.detail-hint {
  color: var(--color-accent);
  font-weight: 700;
}

.empty-state {
  display: grid;
  gap: 0.9rem;
  justify-items: start;
  padding: 2rem;
}

.empty-state h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--color-heading);
}

.empty-state p {
  color: var(--color-text-soft);
}

.primary-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
  padding: 0.95rem 1.2rem;
  border: 1px solid rgba(15, 118, 110, 0.24);
  border-radius: 999px;
  background: linear-gradient(135deg, #0f766e, #115e59);
  box-shadow: 0 1rem 2rem rgba(15, 118, 110, 0.18);
  color: #f7fbfc;
  font-weight: 700;
  text-decoration: none;
}

@media (max-width: 720px) {
  .order-main,
  .order-meta {
    flex-direction: column;
    align-items: start;
  }
}
</style>

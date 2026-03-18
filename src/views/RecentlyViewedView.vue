<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'

import { useRecentlyViewedStore } from '@/stores/recentlyViewed'

const recentlyViewedStore = useRecentlyViewedStore()
const { viewedProducts } = storeToRefs(recentlyViewedStore)

const currencyFormatter = new Intl.NumberFormat('zh-TW', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}
</script>

<template>
  <main class="recently-viewed-page">
    <section class="recently-viewed-shell">
      <div class="page-header">
        <p class="eyebrow">Recently Viewed</p>
        <h1>最近瀏覽商品</h1>
        <p>這裡會保留你最近開啟過的商品，方便你快速回到剛剛看過的內容。</p>
      </div>

      <section v-if="viewedProducts.length === 0" class="empty-card">
        <h2>目前還沒有瀏覽紀錄</h2>
        <p>前往商品詳情頁後，最近瀏覽的商品就會自動出現在這裡。</p>
        <RouterLink to="/" class="primary-link">返回商品頁</RouterLink>
      </section>

      <div v-else class="recently-viewed-grid">
        <article
          v-for="product in viewedProducts"
          :key="product.id"
          class="recently-viewed-card"
        >
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
              <h2>{{ product.name }}</h2>
            </RouterLink>

            <p>{{ product.description }}</p>
          </div>

          <div class="product-actions">
            <RouterLink :to="`/products/${product.id}`" class="detail-link">查看詳情</RouterLink>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.recently-viewed-page {
  padding: 2rem 0 4rem;
}

.recently-viewed-shell {
  display: grid;
  gap: 1.5rem;
}

.page-header h1 {
  margin-top: 0.4rem;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.05;
  font-weight: 800;
  color: var(--color-heading);
}

.page-header p:last-child {
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

.empty-card,
.recently-viewed-card {
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: var(--shadow-card);
}

.empty-card {
  display: grid;
  gap: 0.75rem;
  justify-items: start;
  padding: 1.5rem;
}

.empty-card h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-heading);
}

.empty-card p {
  color: var(--color-text-soft);
}

.primary-link,
.detail-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-weight: 700;
  text-decoration: none;
}

.primary-link {
  margin-top: 0.35rem;
  padding: 0.9rem 1.2rem;
  background: linear-gradient(135deg, #0f766e, #115e59);
  color: #f7fbfc;
}

.recently-viewed-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.recently-viewed-card {
  display: grid;
  align-content: start;
  overflow: hidden;
}

.product-image-link img {
  width: 100%;
  aspect-ratio: 1.1;
  object-fit: cover;
}

.product-image-link {
  position: relative;
  display: block;
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

.product-meta span {
  color: var(--color-accent);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.product-meta strong,
.product-title-link h2 {
  color: var(--color-heading);
}

.product-title-link h2 {
  font-size: 1.1rem;
  font-weight: 700;
}

.product-copy p {
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

.product-actions {
  display: flex;
  justify-content: flex-start;
  padding: 1rem;
}

.detail-link {
  padding: 0.8rem 1rem;
  background: rgba(15, 118, 110, 0.08);
  color: var(--color-accent);
}

@media (max-width: 960px) {
  .recently-viewed-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterLink } from 'vue-router'

import { useWishlistStore } from '@/stores/wishlist'

const wishlistStore = useWishlistStore()
const { favoritedProducts } = storeToRefs(wishlistStore)

const currencyFormatter = new Intl.NumberFormat('zh-TW', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

function removeFavorite(productId: number) {
  wishlistStore.removeFavorite(productId)
}
</script>

<template>
  <main class="wishlist-page">
    <section class="wishlist-shell">
      <div class="wishlist-header">
        <p class="eyebrow">Wishlist</p>
        <h1>收藏清單</h1>
        <p>把喜歡的商品先收藏起來，之後可以再回來比較或前往商品詳情頁查看。</p>
      </div>

      <section v-if="favoritedProducts.length === 0" class="empty-card">
        <h2>目前還沒有收藏商品</h2>
        <p>到商品列表頁逛逛，把喜歡的商品加入收藏，就能在這裡快速找到它們。</p>
        <RouterLink to="/" class="primary-link">返回商品頁</RouterLink>
      </section>

      <div v-else class="wishlist-grid">
        <article v-for="product in favoritedProducts" :key="product.id" class="wishlist-card">
          <RouterLink :to="`/products/${product.id}`" class="wishlist-image-link">
            <img :src="product.image" :alt="product.name" />
          </RouterLink>

          <div class="wishlist-copy">
            <div class="wishlist-meta">
              <span>{{ product.category }}</span>
              <strong>{{ formatCurrency(product.price) }}</strong>
            </div>

            <RouterLink :to="`/products/${product.id}`" class="wishlist-title-link">
              <h2>{{ product.name }}</h2>
            </RouterLink>
            <p>{{ product.description }}</p>
          </div>

          <div class="wishlist-actions">
            <RouterLink :to="`/products/${product.id}`" class="detail-link">查看詳情</RouterLink>
            <button
              type="button"
              class="wishlist-icon-button active"
              :aria-label="`將 ${product.name} 從收藏移除`"
              @click="removeFavorite(product.id)"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 20.25 4.8 13.41a4.52 4.52 0 0 1 0-6.48 4.73 4.73 0 0 1 6.6 0L12 7.51l.6-.58a4.73 4.73 0 0 1 6.6 0 4.52 4.52 0 0 1 0 6.48Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.wishlist-page {
  padding: 2rem 0 4rem;
}

.wishlist-shell {
  display: grid;
  gap: 1.5rem;
}

.wishlist-header h1 {
  margin-top: 0.4rem;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.05;
  font-weight: 800;
  color: var(--color-heading);
}

.wishlist-header p:last-child {
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

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.wishlist-card,
.empty-card {
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.78);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.wishlist-card {
  display: grid;
  align-content: start;
}

.wishlist-image-link img {
  width: 100%;
  aspect-ratio: 1.1;
  object-fit: cover;
}

.wishlist-copy {
  display: grid;
  gap: 0.75rem;
  padding: 1rem 1rem 0;
}

.wishlist-meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.wishlist-meta span {
  color: var(--color-accent);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.wishlist-meta strong,
.wishlist-title-link h2 {
  color: var(--color-heading);
}

.wishlist-title-link h2 {
  font-size: 1.1rem;
  font-weight: 700;
}

.wishlist-copy p {
  color: var(--color-text-soft);
}

.wishlist-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem;
}

.detail-link,
.primary-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  font-weight: 700;
  text-decoration: none;
}

.detail-link {
  padding: 0.8rem 1rem;
  background: rgba(15, 118, 110, 0.08);
  color: var(--color-accent);
}

.wishlist-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: #fff;
  color: #111827;
  cursor: pointer;
}

.wishlist-icon-button.active {
  color: #dc2626;
}

.wishlist-icon-button svg {
  width: 1.2rem;
  height: 1.2rem;
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

.primary-link {
  margin-top: 0.35rem;
  padding: 0.9rem 1.2rem;
  background: linear-gradient(135deg, #0f766e, #115e59);
  color: #f7fbfc;
}

@media (max-width: 960px) {
  .wishlist-grid {
    grid-template-columns: 1fr;
  }
}
</style>

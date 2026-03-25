<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, RouterView, useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useProfileStore } from '@/stores/profile'
import { useRecentlyViewedStore } from '@/stores/recentlyViewed'
import { useUiStore } from '@/stores/ui'
import { useWishlistStore } from '@/stores/wishlist'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const profileStore = useProfileStore()
const uiStore = useUiStore()
const wishlistStore = useWishlistStore()
const recentlyViewedStore = useRecentlyViewedStore()

const { itemCount } = storeToRefs(cartStore)
const { isAuthenticated } = storeToRefs(authStore)
const { profile } = storeToRefs(profileStore)
const { theme } = storeToRefs(uiStore)
const { favoriteIds } = storeToRefs(wishlistStore)
const { productIds } = storeToRefs(recentlyViewedStore)

const authLabel = computed(() => (isAuthenticated.value ? profile.value.name : '未登入'))
const themeLabel = computed(() => (theme.value === 'dark' ? 'Dark' : 'Light'))
const themeToggleLabel = computed(() =>
  theme.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
)

function handleLogout() {
  authStore.logout()
  void router.push('/')
}

function handleThemeToggle() {
  uiStore.toggleTheme()
}
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <RouterLink to="/" class="brand">
        <span class="brand-mark">Atelier</span>
        <span class="brand-copy">精選日常物品</span>
      </RouterLink>

      <nav class="app-nav">
        <RouterLink to="/">商品頁</RouterLink>
        <RouterLink to="/recently-viewed">
          最近瀏覽<span class="nav-badge">{{ productIds.length }}</span>
        </RouterLink>
        <RouterLink to="/wishlist">
          收藏<span class="nav-badge">{{ favoriteIds.length }}</span>
        </RouterLink>
        <RouterLink to="/cart">
          購物車<span class="nav-badge">{{ itemCount }}</span>
        </RouterLink>
        <RouterLink to="/checkout">結帳</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/orders">訂單紀錄</RouterLink>
      </nav>

      <div class="auth-actions">
        <button
          type="button"
          class="theme-switcher"
          :aria-label="themeToggleLabel"
          @click="handleThemeToggle"
        >
          <span class="theme-switcher-label">Theme</span>
          <span class="theme-switcher-value">{{ themeLabel }}</span>
        </button>
        <RouterLink v-if="isAuthenticated" to="/profile" class="auth-status profile-entry">
          {{ authLabel }}
        </RouterLink>
        <span v-else class="auth-status">{{ authLabel }}</span>
        <RouterLink v-if="!isAuthenticated" to="/login" class="auth-link">登入</RouterLink>
        <button v-else type="button" class="auth-link logout-button" @click="handleLogout">
          登出
        </button>
      </div>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
.app-shell {
  width: min(100%, 72rem);
  margin: 0 auto;
}

.app-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 0 0.5rem;
}

.brand {
  display: inline-flex;
  flex-direction: column;
  gap: 0.1rem;
  color: var(--color-heading);
}

.brand-mark {
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.brand-copy {
  font-size: 1.3rem;
  font-weight: 800;
}

.app-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.app-nav a,
.auth-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border-radius: 999px;
  padding: 0.45rem 0.85rem;
  color: var(--color-text);
}

.nav-badge {
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

.auth-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.theme-switcher {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.35rem;
  padding: 0.45rem 0.7rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
}

.theme-switcher:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-1px);
}

.theme-switcher-label {
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-soft);
}

.theme-switcher-value {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3.5rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.12);
  color: var(--color-accent);
  font-size: 0.82rem;
  font-weight: 800;
}

.auth-status {
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.08);
  color: var(--color-accent);
  font-size: 0.82rem;
  font-weight: 700;
}

.profile-entry {
  text-decoration: none;
}

.logout-button {
  border: 0;
  background: rgba(15, 118, 110, 0.14);
  cursor: pointer;
}

.app-nav a.router-link-exact-active,
.auth-link.router-link-exact-active,
.profile-entry.router-link-exact-active {
  background: var(--color-background-mute);
  color: var(--color-heading);
}

@media (max-width: 860px) {
  .app-header {
    grid-template-columns: 1fr;
    justify-items: start;
  }

  .app-nav {
    justify-content: start;
    flex-wrap: wrap;
  }

  .auth-actions {
    flex-wrap: wrap;
  }

  .theme-switcher {
    order: -1;
  }
}
</style>

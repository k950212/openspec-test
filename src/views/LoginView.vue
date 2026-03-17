<script setup lang="ts">
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { loginError, demoCredentials } = storeToRefs(authStore)

const form = reactive({
  email: demoCredentials.value.email,
  password: demoCredentials.value.password,
})

function handleLogin() {
  const succeeded = authStore.login(form.email, form.password)

  if (!succeeded) {
    return
  }

  void router.push('/')
}
</script>

<template>
  <main class="login-page">
    <section class="login-shell">
      <div class="login-copy">
        <p class="eyebrow">Mock Login</p>
        <h1>使用測試帳號登入前端會員系統</h1>
        <p class="description">
          這個登入流程目前是純前端模擬驗證，輸入固定帳號密碼後即可進入已登入狀態並繼續購物。
        </p>

        <div class="credential-card">
          <p>測試帳號</p>
          <strong>{{ demoCredentials.email }}</strong>
          <span>密碼：{{ demoCredentials.password }}</span>
        </div>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          Email
          <a-input
            v-model:value="form.email"
            type="email"
            autocomplete="username"
            placeholder="demo@example.com"
            size="large"
            @input="authStore.clearLoginError()"
          />
        </label>

        <label>
          Password
          <a-input-password
            v-model:value="form.password"
            autocomplete="current-password"
            placeholder="123456"
            size="large"
            @input="authStore.clearLoginError()"
          />
        </label>

        <p v-if="loginError" class="error-message">{{ loginError }}</p>

        <button type="submit" class="primary-action">登入</button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  padding: 2rem 0 4rem;
}

.login-shell {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(0, 1.1fr) minmax(20rem, 28rem);
  align-items: start;
}

.login-copy,
.login-form {
  border: 1px solid var(--color-border);
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.72), transparent 35%),
    linear-gradient(135deg, rgba(15, 118, 110, 0.08), rgba(214, 158, 46, 0.08)),
    var(--color-surface);
  box-shadow: var(--shadow-card);
}

.login-copy {
  display: grid;
  gap: 1rem;
  padding: 2rem;
}

.eyebrow {
  color: var(--color-accent);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 700;
}

.login-copy h1 {
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 0.98;
  font-weight: 800;
  color: var(--color-heading);
}

.description {
  color: var(--color-text-soft);
  font-size: 1rem;
}

.credential-card {
  display: grid;
  gap: 0.35rem;
  max-width: 20rem;
  margin-top: 0.5rem;
  padding: 1rem 1.1rem;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid var(--color-border);
}

.credential-card p,
.credential-card span {
  color: var(--color-text-soft);
}

.credential-card strong {
  color: var(--color-heading);
  font-size: 1.1rem;
  font-weight: 800;
}

.login-form {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
}

.login-form label {
  display: grid;
  gap: 0.45rem;
  color: var(--color-heading);
  font-weight: 600;
}

:deep(.login-form .ant-input),
:deep(.login-form .ant-input-affix-wrapper) {
  border-radius: 18px;
  border-color: var(--color-border);
  background: rgba(255, 255, 255, 0.82);
  color: var(--color-heading);
  box-shadow: none;
}

:deep(.login-form .ant-input-affix-wrapper .ant-input) {
  background: transparent;
}

.error-message {
  color: #b91c1c;
  font-weight: 600;
}

.primary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.95rem 1.2rem;
  border: 1px solid rgba(15, 118, 110, 0.24);
  border-radius: 999px;
  background: linear-gradient(135deg, #0f766e, #115e59);
  box-shadow: 0 1rem 2rem rgba(15, 118, 110, 0.18);
  color: #f7fbfc;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 900px) {
  .login-shell {
    grid-template-columns: 1fr;
  }
}
</style>

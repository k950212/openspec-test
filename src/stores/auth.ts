import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const AUTH_STORAGE_KEY = 'atelier-auth-session'
const DEMO_EMAIL = 'demo@example.com'
const DEMO_PASSWORD = '123456'

function loadStoredSession() {
  if (typeof window === 'undefined') {
    return false
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY)

  if (!rawValue) {
    return false
  }

  try {
    const parsedValue = JSON.parse(rawValue)
    return parsedValue === true
  } catch {
    return false
  }
}

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(loadStoredSession())
  const loginError = ref('')

  if (typeof window !== 'undefined') {
    watch(isAuthenticated, (value) => {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value))
    })
  }

  const demoCredentials = computed(() => ({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  }))

  function login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase()

    if (normalizedEmail === DEMO_EMAIL && password === DEMO_PASSWORD) {
      isAuthenticated.value = true
      loginError.value = ''
      return true
    }

    isAuthenticated.value = false
    loginError.value = 'Email 或密碼不正確，請使用示範帳號登入。'
    return false
  }

  function logout() {
    isAuthenticated.value = false
    loginError.value = ''
  }

  function clearLoginError() {
    loginError.value = ''
  }

  return {
    isAuthenticated,
    loginError,
    demoCredentials,
    login,
    logout,
    clearLoginError,
  }
})

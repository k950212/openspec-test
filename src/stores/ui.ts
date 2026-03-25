import { defineStore } from 'pinia'
import { notification } from 'ant-design-vue'
import { ref } from 'vue'

export type ThemeName = 'light' | 'dark'

const THEME_STORAGE_KEY = 'atelier-theme'

notification.config({
  maxCount: 5,
  placement: 'topRight',
  duration: 2.2,
})

export const useUiStore = defineStore('ui', () => {
  const theme = ref<ThemeName>('light')

  function applyTheme(nextTheme: ThemeName) {
    theme.value = nextTheme

    if (typeof document === 'undefined') {
      return
    }

    document.documentElement.dataset.theme = nextTheme
    document.documentElement.style.colorScheme = nextTheme
  }

  function initializeTheme() {
    if (typeof window === 'undefined') {
      return
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

    if (storedTheme === 'light' || storedTheme === 'dark') {
      applyTheme(storedTheme)
      return
    }

    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'

    applyTheme(preferredTheme)
  }

  function setTheme(nextTheme: ThemeName) {
    applyTheme(nextTheme)

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    }
  }

  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  function showSuccessToast(message: string, title = '\u64cd\u4f5c\u6210\u529f') {
    notification.success({
      message: title,
      description: message,
    })
  }

  function showRemovalToast(message: string) {
    notification.info({
      message: '\u5df2\u5f9e\u6e05\u55ae\u4e2d\u79fb\u9664',
      description: message,
    })
  }

  function showWarningToast(message: string, title = '\u63d0\u9192') {
    notification.warning({
      message: title,
      description: message,
    })
  }

  return {
    theme,
    initializeTheme,
    setTheme,
    toggleTheme,
    showSuccessToast,
    showRemovalToast,
    showWarningToast,
  }
})

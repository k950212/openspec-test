import { defineStore } from 'pinia'
import { notification } from 'ant-design-vue'

notification.config({
  maxCount: 5,
  placement: 'topRight',
  duration: 2.2,
})

export const useUiStore = defineStore('ui', () => {
  function showSuccessToast(message: string, title = '操作成功') {
    notification.success({
      message: title,
      description: message,
    })
  }

  function showRemovalToast(message: string) {
    notification.info({
      message: '已從購物車移除',
      description: message,
    })
  }

  function showWarningToast(message: string, title = '請先登入') {
    notification.warning({
      message: title,
      description: message,
    })
  }

  return {
    showSuccessToast,
    showRemovalToast,
    showWarningToast,
  }
})

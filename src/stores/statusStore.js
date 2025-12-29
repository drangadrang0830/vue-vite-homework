import { ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('statusStore', () => {
  const isLoading = ref(false)
  const loadingItem = ref('')
  const messages = ref([])

  //吐司訊息預處理
  const handleMessage = (apiResponse, defaultTitle = '操作') => {
    let success = false
    let title = `${defaultTitle}失敗`
    let content = '發生未知錯誤'
    let style = 'danger'

    if (apiResponse && apiResponse.data && apiResponse.data.success !== undefined) {
      success = apiResponse.data.success
      content = apiResponse.data.message

      if (success) {
        style = 'success'
        title = `${defaultTitle}成功`
      }
    } else if (apiResponse instanceof Error) {
      style = 'danger'

      const rawMessage = apiResponse.response?.data?.message
      if (Array.isArray(rawMessage)) {
        content = rawMessage.join('、')
      } else if (typeof rawMessage === 'string') {
        content = rawMessage
      } else {
        content = apiResponse.message || '連線逾時或伺服器錯誤'
      }
    }

    if (!content) {
      content = style === 'success' ? '操作成功' : '操作失敗'
    }

    pushMessage({ title, style, content })
    isLoading.value = false
    return success
  }

  //新增吐司訊息
  const pushMessage = (data) => {
    const { title, content, style = 'success' } = data
    messages.value.push({
      id: Date.now(),
      style,
      title,
      content
    })
  }

  //移除吐司訊息
  const removeMessage = (id) => {
    const index = messages.value.findIndex((message) => message.id === id)
    if (index !== -1) {
      messages.value.splice(index, 1)
    }
  }

  //進度條控制區------
  const isOrderCompleted = ref(false)

  const setOrderCompleted = (status) => {
    isOrderCompleted.value = status
  }

  const resetOrderProgress = () => {
    isOrderCompleted.value = false
  }
  //-----------------

  return {
    messages,
    isLoading,
    pushMessage,
    removeMessage,
    loadingItem,
    handleMessage,
    isOrderCompleted,
    setOrderCompleted,
    resetOrderProgress
  }
})

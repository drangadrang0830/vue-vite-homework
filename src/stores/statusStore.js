import { ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('statusStore', () => {
  const isLoading = ref(false)
  const loadingItem = ref('')
  const messages = ref([])

  //api回應轉吐司訊息預處理
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

  //直接新增吐司訊息(非API管道))
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
  const previousStep = ref(0)

  //更新訂單完成狀態
  const setOrderCompleted = (status) => {
    isOrderCompleted.value = status
  }

  //紀錄目前進度
  const setPreviousStep = (step) => {
    previousStep.value = step
  }

  //重置目前進度
  const resetOrderProgress = () => {
    isOrderCompleted.value = false
    previousStep.value = 0
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
    resetOrderProgress,
    previousStep,
    setPreviousStep
  }
})

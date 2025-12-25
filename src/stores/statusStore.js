import { ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('statusStore', () => {
  const isLoading = ref(false)
  const loadingItem = ref('')
  const messages = ref([])

  //吐司元件
  const pushMessage = (data) => {
    const { title, content, style = 'success' } = data
    messages.value.push({
      id: Date.now(),
      style,
      title,
      content
    })
  }

  const removeMessage = (id) => {
    const index = messages.value.findIndex((message) => message.id === id)
    if (index !== -1) {
      messages.value.splice(index, 1)
    }
  }

  //進度條
  const isOrderCompleted = ref(false)

  const setOrderCompleted = (status) => {
    isOrderCompleted.value = status
  }

  const resetOrderProgress = () => {
    isOrderCompleted.value = false
  }

  return {
    messages,
    isLoading,
    pushMessage,
    removeMessage,
    loadingItem,

    isOrderCompleted,
    setOrderCompleted,
    resetOrderProgress
  }
})

import { ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('statusStore', () => {
  // const pageNumber = ref({})
  const isLoading = ref(false)

  const loadingItem = ref('')

  const messages = ref([])

  const pushMessage = (data) => {
    const { title, content, style = 'success' } = data
    messages.value.push({
      id: Date.now(),
      style,
      title,
      content,
    })
  }

  const removeMessage = (id) => {
    const index = messages.value.findIndex((message) => message.id === id)
    if (index !== -1) {
      messages.value.splice(index, 1)
    }
  }

  return {
    messages,
    isLoading,
    pushMessage,
    removeMessage,
    loadingItem,
  }
})

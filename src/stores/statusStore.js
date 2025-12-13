import { ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('statusStore', () => {
  // const pageNumber = ref({})
  const isLoading = ref(false)

  const messages = ref([])

  // 吐司內容製作 (稍微修改以加入 ID)
  const pushMessage = (data) => {
    const { title, content, style = 'success' } = data
    messages.value.push({
      id: Date.now(), // <-- 新增 ID
      style,
      title,
      content,
    })
  }

  // 新增：根據 ID 移除特定的訊息
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
  }
})

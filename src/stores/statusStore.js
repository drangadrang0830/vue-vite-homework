import { ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('statusStore', () => {
  const pageNumber = ref({})
  // const isLoading = ref('false')

  //使用吐司推出通知 函式
  // const pushMessage = (data) => {
  //   //取出 title, content style 並調整為success字串
  //   const { title, content, style = 'success' } = data
  //   this.messages.push({ style, title, content })
  // }

  return {
    pageNumber,
    // isLoading,
    // pushMessage,
  }
})

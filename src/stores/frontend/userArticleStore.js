import { ref } from 'vue'
import { userArticles } from '@/api'
import { defineStore } from 'pinia'
import useStatusStore from '@/stores/statusStore'

export default defineStore('userArticleStore', () => {
  const articles = ref([])
  let isFetching = false

  //取得文章資訊
  const getArticles = async () => {
    if (articles.value.length > 0 || isFetching) return
    isFetching = true
    const statusStore = useStatusStore()
    try {
      const response = await userArticles.getList()
      articles.value = response.data.articles
    } catch (error) {
      statusStore.handleMessage(error, '文章讀取')
    } finally {
      isFetching = false
    }
  }

  return {
    articles,
    getArticles
  }
})

import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import useStatusStore from '@/stores/statusStore'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH

export default defineStore('userArticleStore', () => {
  const articles = ref([])

  let isFetching = false

  //取得所有產品資訊
  const getArticles = async () => {
    if (articles.value.length > 0 || isFetching) return
    isFetching = true
    const url = `${APIurl}api/${PATHurl}/articles`
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    try {
      const response = await axios.get(url)
      articles.value = response.data.articles
    } catch (error) {
      statusStore.handleMessage(error, '文章讀取')
    } finally {
      statusStore.isLoading = false
      isFetching = false
    }
  }

  return {
    articles,
    getArticles
  }
})

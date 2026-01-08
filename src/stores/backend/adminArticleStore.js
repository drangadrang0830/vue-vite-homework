import { ref } from 'vue'
import { adminArticles } from '@/api'
import { defineStore } from 'pinia'
import useStatusStore from '@/stores/statusStore'

export default defineStore('adminArticleStore', () => {
  const articles = ref([])
  const article = ref({
    author: '',
    content: '',
    create_at: 0,
    description: '',
    id: '',
    image: '',
    isPublic: false,
    tag: [],
    title: ''
  })
  const pagination = ref({})

  //讀取文章資訊
  const getArticles = async (page = 1) => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    try {
      const response = await adminArticles.get(page)
      if (response.data.success) {
        articles.value = response.data.articles
        pagination.value = response.data.pagination
      }
    } catch (error) {
      statusStore.handleMessage(error, '讀取文章')
    } finally {
      statusStore.isLoading = false
    }
  }

  //取得單一文章
  const getArticle = async (id) => {
    article.value = {}
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    try {
      const response = await adminArticles.getSingle(id)
      if (response.data.success) {
        article.value = response.data.article
      }
    } catch (error) {
      statusStore.handleMessage(error, '讀取指定文章')
    } finally {
      statusStore.isLoading = false
    }
  }

  //新增/變更函式
  const updateArticle = async (item) => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    const title = item.id ? '修改文章' : '新增文章'
    try {
      const response = await adminArticles.update(item.id, item)
      const success = statusStore.handleMessage(response, title)
      if (success) {
        getArticles(pagination.value.current_page || 1)
        return true
      }
    } catch (error) {
      statusStore.handleMessage(error, title)
      return false
    } finally {
      statusStore.isLoading = false
    }
  }

  // 刪除文章
  const deleteArticle = async (item) => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    const title = '刪除文章'
    try {
      const response = await adminArticles.delete(item.id)
      const success = statusStore.handleMessage(response, title)
      if (success) {
        getArticles()
        return true
      }
    } catch (error) {
      statusStore.handleMessage(error, title)
      return false
    } finally {
      statusStore.isLoading = false
    }
  }

  return {
    getArticles,
    articles,
    pagination,
    article,
    getArticle,
    updateArticle,
    deleteArticle
  }
})

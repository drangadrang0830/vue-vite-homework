import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import useStatusStore from '@/stores/statusStore'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH

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

  //取得單一文章
  const getArticle = async (id) => {
    article.value = {}
    const statusStore = useStatusStore()
    const url = `${APIurl}api/${PATHurl}/admin/article/${id}`
    statusStore.isLoading = true
    try {
      const response = await axios.get(url)
      if (response.data.success) {
        article.value = response.data.article
      }
    } catch (error) {
      statusStore.handleMessage(error, '單一文章')
    } finally {
      statusStore.isLoading = false
    }
  }

  //新增/變更函式
  const updateArticle = async (item) => {
    const statusStore = useStatusStore()
    let url = `${APIurl}api/${PATHurl}/admin/article`
    let httpMethod = 'post'
    let msg = '新增'
    if (item.id) {
      url = `${url}/${item.id}`
      httpMethod = 'put'
      msg = '修改'
    }
    const title = `文章${msg}`
    try {
      const response = await axios[httpMethod](url, { data: item })
      const success = statusStore.handleMessage(response, title)
      if (success) {
        return true
      }
    } catch (error) {
      statusStore.handleMessage(error, title)
      return false
    }
  }

  // 刪除文章
  const deleteArticle = async (item) => {
    const statusStore = useStatusStore()
    const url = `${APIurl}api/${PATHurl}/admin/article/${item.id}`
    statusStore.isLoading = true
    const title = '刪除文章'
    try {
      const response = await axios.delete(url)
      const success = statusStore.handleMessage(response, title)
      if (success) {
        return true
      }
    } catch (error) {
      statusStore.handleMessage(error, title)
      return false
    } finally {
      statusStore.isLoading = false
    }
  }

  //取得文章資訊
  const getArticles = async (page = 1) => {
    const statusStore = useStatusStore()
    const url = `${APIurl}api/${PATHurl}/admin/articles?page=${page}`
    statusStore.isLoading = true

    try {
      const response = await axios.get(url)
      if (response.data.success) {
        articles.value = response.data.articles
        pagination.value = response.data.pagination
      }
    } catch (error) {
      statusStore.handleMessage(error, '文章資訊')
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

import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import useStatusStore from './statusStore'

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
      console.log(article.value)
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      statusStore.pushMessage({
        title: '文章MODAL讀取失敗',
        style: 'danger',
        content: errorMsg
      })
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
    try {
      const response = await axios[httpMethod](url, { data: item })

      if (response.data.success) {
        statusStore.pushMessage({
          title: `${item.title}${msg}成功`,
          style: 'success'
        })
        return true
      }
    } catch (error) {
      const errorMsg = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join('.')
        : error.response?.data?.message || error.message || '未知錯誤'
      statusStore.pushMessage({
        title: `文章${msg}失敗`,
        style: 'danger',
        content: errorMsg
      })
      return false
    }
  }

  // 刪除文章
  const deleteArticle = async (item) => {
    const statusStore = useStatusStore()
    const url = `${APIurl}api/${PATHurl}/admin/article/${item.id}`
    statusStore.isLoading = true

    try {
      const response = await axios.delete(url)
      if (response.data.success) {
        statusStore.pushMessage({
          title: `成功刪除 ${item.title}`,
          style: 'success'
        })
        // getArticles()
        return true
      }
    } catch (error) {
      statusStore.pushMessage({
        title: `刪除文章失敗`,
        style: 'danger',
        content: error.message
      })
      return false
    } finally {
      statusStore.isLoading = false
    }
  }

  //取得產品資訊
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
      // console.log(articles.value, pagination.value)
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      statusStore.pushMessage({
        title: '文章讀取失敗',
        style: 'danger',
        content: errorMsg
      })
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

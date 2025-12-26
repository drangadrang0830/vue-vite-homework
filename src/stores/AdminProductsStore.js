import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import useStatusStore from './statusStore'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH

export default defineStore('AdminProductsStore', () => {
  const products = ref([])
  const pagination = ref({})

  //刪除物品
  const deleteProduct = async (item) => {
    const statusStore = useStatusStore()
    const url = `${APIurl}api/${PATHurl}/admin/product/${item.id}`
    statusStore.isLoading = true
    try {
      const response = await axios.delete(url)
      if (response.data.success) {
        statusStore.pushMessage({
          title: `成功刪除${item.title}`,
          style: 'success'
        })
        getProducts()
        return true
      }
    } catch (error) {
      statusStore.pushMessage({
        title: `刪除產品失敗`,
        style: 'danger',
        content: error.message
      })
      return false
    } finally {
      statusStore.isLoading = false
    }
  }

  //取得產品資訊
  const getProducts = async (page = 1) => {
    const statusStore = useStatusStore()
    const url = `${APIurl}api/${PATHurl}/admin/products/?page=${page}`
    statusStore.isLoading = true

    try {
      const response = await axios.get(url)
      if (response.data.success) {
        products.value = response.data.products
        pagination.value = response.data.pagination
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      statusStore.pushMessage({
        title: '產品讀取失敗',
        style: 'danger',
        content: errorMsg
      })
    } finally {
      statusStore.isLoading = false
    }
  }

  //新增/變更函式
  const updateProduct = async (item) => {
    const statusStore = useStatusStore()
    let url = `${APIurl}api/${PATHurl}/admin/product`
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
        title: `產品${msg}失敗`,
        style: 'danger',
        content: errorMsg
      })
      return false
    }
  }

  // -----------------

  // 處理檔案上傳的方法
  const uploadFile = async (formData) => {
    const statusStore = useStatusStore()
    const url = `${APIurl}api/${PATHurl}/admin/upload`
    try {
      const response = await axios.post(url, formData)
      if (response.data.success) {
        statusStore.pushMessage({
          title: `圖片上傳成功`,
          style: 'success'
        })
        return response.data.imageUrl
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      statusStore.pushMessage({
        title: '圖片上傳失敗',
        style: 'danger',
        content: errorMsg
      })
      return null
    }
  }

  // -----------------

  return {
    products,
    getProducts,
    updateProduct,
    uploadFile,
    pagination,
    deleteProduct
  }
})

import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import useStatusStore from '../stores/statusStore'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH
//Setup Store 設定式寫法
export default defineStore('productsStore', () => {
  const products = ref([])

  const pagination = ref({})

  //取得產品資訊
  const getProducts = async (page = 1) => {
    const statusStore = useStatusStore()
    const getProductsUrl = `${APIurl}api/${PATHurl}/admin/products/?page=${page}`
    statusStore.isLoading = true

    try {
      const response = await axios.get(getProductsUrl)
      if (response.data.success) {
        products.value = response.data.products
        pagination.value = response.data.pagination
      } else {
        statusStore.pushMessage({
          title: `產品取得失敗`,
          style: 'danger',
          content: response.data.message,
        })
      }
    } catch (error) {
      statusStore.pushMessage({
        title: `產品取得伺服器失敗`,
        style: 'danger',
        content: error.message.join('.'),
      })
    } finally {
      statusStore.isLoading = false
    }
  }

  // -----------------

  //新增/變更函式
  const updateProduct = async (item) => {
    const statusStore = useStatusStore()
    let updateProductUrl = `${APIurl}api/${PATHurl}/admin/product`
    let httpMethod = 'post'
    let msg = '新增'
    if (item.id) {
      updateProductUrl = `${updateProductUrl}/${item.id}`
      httpMethod = 'put'
      msg = '修改'
    }
    try {
      const response = await axios[httpMethod](updateProductUrl, { data: item })

      if (response.data.success) {
        statusStore.pushMessage({
          title: `${item.title}${msg}成功`,
          style: 'success',
        })
        return true
      } else {
        const contentMsg = Array.isArray(response.data.message)
          ? response.data.message.join('.')
          : response.data.message
        statusStore.pushMessage({
          title: `產品${msg}失敗`,
          style: 'danger',
          content: contentMsg,
        })
        return false
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const contentMsg = Array.isArray(error.response?.data?.message)
          ? error.response.data.message.join('.')
          : error.message || '未知錯誤'
        statusStore.pushMessage({
          title: `產品${msg}失敗`,
          style: 'danger',
          content: contentMsg,
        })
        return false
      } else {
        statusStore.pushMessage({
          title: `產品${msg}伺服器失敗`,
          style: 'danger',
          content: error.message,
        })
      }
      return false
    }
  }

  //刪除物品函式
  const deleteProduct = async (item) => {
    const statusStore = useStatusStore()
    const deleteProductUrl = `${APIurl}api/${PATHurl}/admin/product/${item.id}`
    statusStore.isLoading = true
    try {
      const response = await axios.delete(deleteProductUrl)
      if (response.data.success) {
        statusStore.pushMessage({
          title: `成功刪除${item.title}`,
          style: 'success',
        })
        getProducts()
        return true
      }
    } catch (error) {
      statusStore.pushMessage({
        title: `帳號登出伺服器失敗`,
        style: 'danger',
        content: error.message,
      })
      return false
    } finally {
      statusStore.isLoading = false // (E) 一定會執行到這裡，關閉 Loading
    }
  }
  // -----------------

  // 處理檔案上傳的方法
  const uploadFile = async (formData) => {
    const statusStore = useStatusStore()
    const uploadFileUrl = `${APIurl}api/${PATHurl}/admin/upload`
    try {
      const response = await axios.post(uploadFileUrl, formData)
      if (response.data.success) {
        statusStore.pushMessage({
          title: `圖片上傳成功`,
          style: 'success',
        })
        return response.data.imageUrl
      } else {
        const contentMsg = Array.isArray(response.data.message)
          ? response.data.message.join('.')
          : response.data.message
        statusStore.pushMessage({
          title: `圖片上傳失敗`,
          style: 'danger',
          content: contentMsg,
        })
        return null
      }
    } catch (error) {
      statusStore.pushMessage({
        title: `圖片上傳伺服器失敗`,
        style: 'danger',
        content: error.message,
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
    deleteProduct,
  }
})

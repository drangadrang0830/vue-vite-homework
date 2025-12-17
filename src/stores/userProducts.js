import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import useStatusStore from './statusStore'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH
//Setup Store 設定式寫法
export default defineStore('userProducts', () => {
  const products = ref([])

  const pagination = ref({})

  const product = ref({})

  //取得產品資訊
  const getProducts = async (page = 1) => {
    const statusStore = useStatusStore()
    const getProductsUrl = `${APIurl}api/${PATHurl}/products/?page=${page}`
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
        content: error.message,
      })
    } finally {
      statusStore.isLoading = false
    }
  }

  //取得單一產品說明
  const descriptionProduct = async (id) => {
    const statusStore = useStatusStore()
    const descriptionProductUrl = `${APIurl}api/${PATHurl}/product/${id}`
    statusStore.isLoading = true

    try {
      const response = await axios.get(descriptionProductUrl)
      if (response.data.success) {
        product.value = response.data.product
      } else {
        statusStore.pushMessage({
          title: `介紹讀取失敗`,
          style: 'danger',
          content: response.data.message,
        })
      }
    } catch (error) {
      statusStore.pushMessage({
        title: `介紹讀取伺服器失敗`,
        style: 'danger',
        content: error.message,
      })
    } finally {
      statusStore.isLoading = false
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
    uploadFile,
    pagination,
    descriptionProduct,
    product,
  }
})

import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import useStatusStore from './statusStore'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH

export default defineStore('userProducts', () => {
  const products = ref([])
  const product = ref({})
  const categories = ref([])

  //取得產品資訊
  const getProducts = async () => {
    const filterString = '農特產品'
    const title = `產品讀取`
    const url = `${APIurl}api/${PATHurl}/products/all`
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    try {
      const response = await axios.get(url)
      const productsList = response.data.products || []
      products.value = productsList.filter((item) => item.category?.includes(filterString))

      console.log(products.value)
      const categoryCounts = products.value.reduce((acc, currentItem) => {
        const categoryName = currentItem.category
        if (categoryName) {
          acc[categoryName] = (acc[categoryName] || 0) + 1
        }
        return acc
      }, {})
      const uniqueCategoriesArray = Object.keys(categoryCounts).map((name) => {
        return {
          name: name,
          count: categoryCounts[name]
        }
      })
      categories.value = [
        { name: '全部商品', count: products.value.length },
        ...uniqueCategoriesArray
      ]
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      statusStore.pushMessage({
        title: `${title}失敗`,
        style: 'danger',
        content: errorMsg
      })
    } finally {
      statusStore.isLoading = false
    }
  }

  //取得單一產品說明
  const descriptionProduct = async (id) => {
    product.value = {}
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
          content: response.data.message
        })
      }
    } catch (error) {
      statusStore.pushMessage({
        title: `介紹讀取伺服器失敗`,
        style: 'danger',
        content: error.message
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
          style: 'success'
        })
        return response.data.imageUrl
      } else {
        const contentMsg = Array.isArray(response.data.message)
          ? response.data.message.join('.')
          : response.data.message
        statusStore.pushMessage({
          title: `圖片上傳失敗`,
          style: 'danger',
          content: contentMsg
        })
        return null
      }
    } catch (error) {
      statusStore.pushMessage({
        title: `圖片上傳伺服器失敗`,
        style: 'danger',
        content: error.message
      })
      return null
    }
  }

  // -----------------

  return {
    products,
    getProducts,
    categories,
    uploadFile,
    descriptionProduct,
    product
  }
})

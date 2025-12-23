import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import useStatusStore from './statusStore'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH

export default defineStore('userProducts', () => {
  const allProducts = ref([]) // 原始總資料
  const homeData = ref([]) // 給首頁用
  const attractionData = ref([]) // 給景點用
  const farmProducts = ref([]) // 給農特產品用
  const categories = ref([]) // 農特產品分類選單
  const product = ref({})

  let isFetching = false

  //取得產品資訊
  const getAllProducts = async () => {
    if (allProducts.value.length > 0 || isFetching) return

    isFetching = true
    const url = `${APIurl}api/${PATHurl}/products/all`
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    try {
      const response = await axios.get(url)
      const data = response.data.products || []
      allProducts.value = data

      homeData.value = data.filter((item) => item.category === '首頁')

      const attractionTargets = ['美食饗宴', '夜宿地點', '熱門景點', '歲時祭儀']
      attractionData.value = data.filter((item) => attractionTargets.includes(item.category))

      farmProducts.value = data.filter((item) => item.category?.includes('農特產品'))
      updateFarmCategories()
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      statusStore.pushMessage({ title: '資料讀取失敗', style: 'danger', content: errorMsg })
    } finally {
      statusStore.isLoading = false
      isFetching = false
    }
  }

  const updateFarmCategories = () => {
    const categoryCounts = farmProducts.value.reduce((acc, item) => {
      const name = item.category
      if (name) acc[name] = (acc[name] || 0) + 1
      return acc
    }, {})

    categories.value = [
      { name: '全部商品', count: farmProducts.value.length },
      ...Object.keys(categoryCounts).map((name) => ({ name, count: categoryCounts[name] }))
    ]
  }

  //取得單一產品說明
  const descriptionProduct = async (id) => {
    product.value = {}
    const statusStore = useStatusStore()
    const title = `產品說明讀取`
    const url = `${APIurl}api/${PATHurl}/product/${id}`
    statusStore.isLoading = true
    try {
      const response = await axios.get(url)
      if (response.data.success) {
        product.value = response.data.product
      }
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
    getAllProducts,
    homeData,
    attractionData,
    farmProducts,
    categories,
    descriptionProduct,
    uploadFile,
    product
  }
})

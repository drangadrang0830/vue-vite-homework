import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import useStatusStore from '@/stores/statusStore'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH

export default defineStore('adminProductsStore', () => {
  const products = ref([])
  const pagination = ref({})

  //取得商品資訊
  const getProducts = async (page = 1) => {
    const statusStore = useStatusStore()
    const url = `${APIurl}api/${PATHurl}/admin/products?page=${page}`
    statusStore.isLoading = true
    try {
      const response = await axios.get(url)
      if (response.data.success) {
        products.value = response.data.products
        pagination.value = response.data.pagination
      }
    } catch (error) {
      statusStore.handleMessage(error, '讀取商品')
    } finally {
      statusStore.isLoading = false
    }
  }

  //刪除商品
  const deleteProduct = async (item) => {
    const statusStore = useStatusStore()
    const url = `${APIurl}api/${PATHurl}/admin/product/${item.id}`
    statusStore.isLoading = true
    const title = '刪除商品'
    try {
      const response = await axios.delete(url)
      const success = statusStore.handleMessage(response, title)
      if (success) {
        getProducts()
        return true
      }
    } catch (error) {
      statusStore.handleMessage(error, title)
      return false
    } finally {
      statusStore.isLoading = false
    }
  }

  //新增/變更商品
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
    const title = `商品${msg}`
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

  // 圖片上傳
  const uploadFile = async (formData) => {
    const statusStore = useStatusStore()
    const url = `${APIurl}api/${PATHurl}/admin/upload`
    const title = '圖片上傳'
    try {
      const response = await axios.post(url, formData)
      const success = statusStore.handleMessage(response, title)
      if (success) {
        return response.data.imageUrl
      }
    } catch (error) {
      statusStore.handleMessage(error, title)
      return null
    }
  }

  return {
    products,
    getProducts,
    updateProduct,
    uploadFile,
    pagination,
    deleteProduct
  }
})

import { ref } from 'vue'
import { adminProducts } from '@/api'
import { defineStore } from 'pinia'
import useStatusStore from '@/stores/statusStore'

export default defineStore('adminProductsStore', () => {
  const products = ref([])
  const pagination = ref({})

  //取得商品資訊
  const getProducts = async (page = 1) => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    try {
      const response = await adminProducts.get(page)
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

  //刪除指定商品
  const deleteProduct = async (item) => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    const title = '刪除商品'
    try {
      const response = await adminProducts.delete(item.id)
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
    statusStore.isLoading = true
    const title = item.id ? '修改商品' : '新增商品'
    try {
      const response = await adminProducts.update(item.id, item)
      const success = statusStore.handleMessage(response, title)
      if (success) {
        getProducts(pagination.value.current_page || 1)
        return true
      }
    } catch (error) {
      statusStore.handleMessage(error, title)
      return false
    } finally {
      statusStore.isLoading = false
    }
  }

  // 圖片上傳及回報傳連結
  const uploadFile = async (formData) => {
    const statusStore = useStatusStore()
    const title = '圖片上傳'
    try {
      const response = await adminProducts.upload(formData)
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

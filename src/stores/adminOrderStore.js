import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import useStatusStore from '@/stores/statusStore'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH

export default defineStore('adminOrderStore', () => {
  const orders = ref([])

  const pagination = ref({})

  //取得訂單資訊
  const getOrders = async (page = 1) => {
    const statusStore = useStatusStore()
    const url = `${APIurl}api/${PATHurl}/admin/orders/?page=${page}`
    statusStore.isLoading = true
    try {
      const response = await axios.get(url)
      if (response.data.success) {
        orders.value = response.data.orders
        pagination.value = response.data.pagination
      }
    } catch (error) {
      statusStore.handleMessage(error, '取得訂單')
    } finally {
      statusStore.isLoading = false
    }
  }

  //刪除訂單
  const deleteOrder = async (id) => {
    const statusStore = useStatusStore()
    const url = `${APIurl}api/${PATHurl}/admin/order/${id}`
    statusStore.isLoading = true
    const title = '刪除訂單'
    try {
      const response = await axios.delete(url)
      const success = statusStore.handleMessage(response, title)
      if (success) {
        return true
      }
    } catch (error) {
      statusStore.handleMessage(error, title)
      return null
    } finally {
      await getOrders()
      statusStore.isLoading = false
    }
  }

  return {
    orders,
    getOrders,
    pagination,
    deleteOrder
  }
})

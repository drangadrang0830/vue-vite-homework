import { ref } from 'vue'
import { adminOrders } from '@/api'
import { defineStore } from 'pinia'
import useStatusStore from '@/stores/statusStore'

export default defineStore('adminOrderStore', () => {
  const orders = ref([])
  const pagination = ref({})

  //取得訂單資訊
  const getOrders = async (page = 1) => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    try {
      const response = await adminOrders.get(page)
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
    statusStore.isLoading = true
    const title = '刪除訂單'
    try {
      const response = await adminOrders.delete(id)
      const success = statusStore.handleMessage(response, title)
      if (success) {
        getOrders()
        return true
      }
    } catch (error) {
      statusStore.handleMessage(error, title)
      return false
    } finally {
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

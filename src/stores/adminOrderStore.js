import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import useStatusStore from './statusStore'

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
      const errorMsg = error.response?.data?.message || error.message
      statusStore.pushMessage({
        title: '訂單讀取失敗',
        style: 'danger',
        content: errorMsg
      })
    } finally {
      statusStore.isLoading = false
    }
  }

  const deleteOrder = async (id) => {
    const statusStore = useStatusStore()
    const url = `${APIurl}api/${PATHurl}/admin/order/${id}`
    statusStore.isLoading = true
    try {
      const response = await axios.delete(url)
      if (response.data.success) {
        statusStore.pushMessage({
          title: `訂單刪除成功`,
          style: 'success'
        })
        return true
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const contentMsg = Array.isArray(error.response?.data?.message)
          ? error.response.data.message.join('.')
          : error.message || '未知錯誤'
        statusStore.pushMessage({
          title: `訂單刪除失敗`,
          style: 'danger',
          content: contentMsg
        })
        return null
      } else {
        statusStore.pushMessage({
          title: `訂單刪除伺服器失敗`,
          style: 'danger',
          content: error.message
        })
        return null
      }
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

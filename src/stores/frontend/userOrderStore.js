import { defineStore } from 'pinia'
import { userOrders } from '@/api'
import useStatusStore from '@/stores/statusStore'
import useUserCartStore from '@/stores/frontend/userCartStore'

export default defineStore('userOrderStore', () => {
  //送出訂單
  const submitOrder = async (data) => {
    const statusStore = useStatusStore()
    const userCartStore = useUserCartStore()
    statusStore.isLoading = true
    const title = '建立訂單'
    try {
      const response = await userOrders.submit(data)
      const success = statusStore.handleMessage(response, title)
      if (success) {
        userCartStore.getCart()
        return response.data.orderId
      }
    } catch (error) {
      statusStore.handleMessage(error, title)
      return null
    } finally {
      statusStore.isLoading = false
    }
  }

  //查詢訂單
  const getIdOrder = async (orderId) => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    try {
      const response = await userOrders.get(orderId)
      if (response.data.success) {
        return response.data
      }
    } catch (error) {
      statusStore.handleMessage(error, '接收訂單')
      return null
    } finally {
      statusStore.isLoading = false
    }
  }

  //結帳
  const payOrder = async (orderId) => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    const title = '付款'
    try {
      const response = await userOrders.pay(orderId)
      const success = statusStore.handleMessage(response, title)
      if (success) {
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
    submitOrder,
    getIdOrder,
    payOrder
  }
})

import axios from 'axios'
import { defineStore } from 'pinia'
import useStatusStore from '@/stores/statusStore'
import useUserCartStore from '@/stores/userCartStore'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH

export default defineStore('userOrderStore', () => {
  //送出訂單
  const submitOrder = async (data) => {
    const statusStore = useStatusStore()
    const userCartStore = useUserCartStore()
    statusStore.isLoading = true
    const url = `${APIurl}api/${PATHurl}/order`
    const title = '建立訂單'
    try {
      const response = await axios.post(url, { data })
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

  //接收指定訂單
  const getIdOrder = async (orderId) => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    const url = `${APIurl}api/${PATHurl}/order/${orderId}`
    try {
      const response = await axios.get(url)
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
    const url = `${APIurl}api/${PATHurl}/pay/${orderId}`
    const title = '付款'
    try {
      const response = await axios.post(url)
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

import axios from 'axios'
import { defineStore } from 'pinia'
import useStatusStore from './statusStore'
import useUserCartStore from './userCartStore'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH

export default defineStore('userOrderStore', () => {
  //送出訂單
  const submitOrder = async (data) => {
    const statusStore = useStatusStore()
    const userCartStore = useUserCartStore()
    statusStore.isLoading = true
    const url = `${APIurl}api/${PATHurl}/order`
    try {
      const response = await axios.post(url, { data })
      if (response.data.success) {
        statusStore.pushMessage({
          title: `已建立訂單`,
          style: 'success'
        })
        userCartStore.getCart()
        return response.data.orderId
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      statusStore.pushMessage({
        title: '建立訂單失敗',
        style: 'danger',
        content: errorMsg
      })
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
      const errorMsg = error.response?.data?.message || error.message
      statusStore.pushMessage({
        title: '取得訂單資料失敗',
        style: 'danger',
        content: errorMsg
      })
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
    try {
      const response = await axios.post(url)
      if (response.data.success) {
        statusStore.pushMessage({
          title: `付款完成`,
          style: 'success'
        })
        return true
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      statusStore.pushMessage({
        title: '結帳失敗',
        style: 'danger',
        content: errorMsg
      })
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

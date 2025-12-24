import axios from 'axios'
import { defineStore } from 'pinia'
import useStatusStore from './statusStore'
import useUserCartStore from './userCartStore'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH

export default defineStore('userOrder', () => {
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
      if (error.response && error.response.status === 400) {
        const contentMsg = Array.isArray(error.response?.data?.message)
          ? error.response.data.message.join('.')
          : error.message || '未知錯誤'
        statusStore.pushMessage({
          title: `訂單提交失敗`,
          style: 'danger',
          content: contentMsg
        })
        return null
      } else {
        statusStore.pushMessage({
          title: `訂單提交伺服器失敗`,
          style: 'danger',
          content: error.message
        })
        return null
      }
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
      if (error.response && error.response.status === 400) {
        const contentMsg = Array.isArray(error.response?.data?.message)
          ? error.response.data.message.join('.')
          : error.message || '未知錯誤'
        statusStore.pushMessage({
          title: `訂單訊息接收失敗`,
          style: 'danger',
          content: contentMsg
        })
        return null
      } else {
        statusStore.pushMessage({
          title: `訂單訊息接收伺服器失敗`,
          style: 'danger',
          content: error.message
        })
        return null
      }
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
      if (error.response && error.response.status === 400) {
        const contentMsg = Array.isArray(error.response?.data?.message)
          ? error.response.data.message.join('.')
          : error.message || '未知錯誤'
        statusStore.pushMessage({
          title: `付款失敗`,
          style: 'danger',
          content: contentMsg
        })
        return false
      } else {
        statusStore.pushMessage({
          title: `付款伺服器失敗`,
          style: 'danger',
          content: error.message
        })
        return false
      }
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

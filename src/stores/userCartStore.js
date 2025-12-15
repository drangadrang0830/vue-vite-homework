import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import useStatusStore from './statusStore'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH

export default defineStore('userCartStore', () => {
  const cartData = ref([])

  //新增購物車函式
  const addCart = async (id) => {
    const statusStore = useStatusStore()
    statusStore.loadingItem = id
    const addCartUrl = `${APIurl}api/${PATHurl}/cart`
    const cart = {
      product_id: id,
      qty: 1,
    }

    try {
      const response = await axios.post(addCartUrl, { data: cart })
      if (response.data.success) {
        getCart()
        statusStore.pushMessage({
          title: `購物車加入成功`,
          style: 'success',
        })
      } else {
        const contentMsg = Array.isArray(response.data.message)
          ? response.data.message.join('.')
          : response.data.message
        statusStore.pushMessage({
          title: `購物車加入失敗`,
          style: 'danger',
          content: contentMsg,
        })
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const contentMsg = Array.isArray(error.response?.data?.message)
          ? error.response.data.message.join('.')
          : error.message || '未知錯誤'
        statusStore.pushMessage({
          title: `購物車加入失敗`,
          style: 'danger',
          content: contentMsg,
        })
      } else {
        statusStore.pushMessage({
          title: `購物車加入伺服器失敗`,
          style: 'danger',
          content: error.message,
        })
      }
    } finally {
      statusStore.loadingItem = ''
    }
  }

  //讀取購物車函式
  const getCart = async () => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    const getCartUrl = `${APIurl}api/${PATHurl}/cart`
    try {
      const response = await axios.get(getCartUrl)
      if (response.data.success) {
        cartData.value = response.data.data
      } else {
        const contentMsg = Array.isArray(response.data.message)
          ? response.data.message.join('.')
          : response.data.message
        statusStore.pushMessage({
          title: `購物車讀取失敗`,
          style: 'danger',
          content: contentMsg,
        })
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const contentMsg = Array.isArray(error.response?.data?.message)
          ? error.response.data.message.join('.')
          : error.message || '未知錯誤'
        statusStore.pushMessage({
          title: `購物車讀取失敗`,
          style: 'danger',
          content: contentMsg,
        })
      } else {
        statusStore.pushMessage({
          title: `購物車讀取伺服器失敗`,
          style: 'danger',
          content: error.message,
        })
      }
    } finally {
      statusStore.isLoading = false
    }
  }

  return {
    addCart,
    getCart,
    cartData,
  }
})

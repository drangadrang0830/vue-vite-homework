import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import useStatusStore from './statusStore'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH

export default defineStore('userCartStore', () => {
  const cartData = ref({})

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
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        statusStore.pushMessage({
          title: `購物車加入失敗`,
          style: 'danger',
          content: error.data.message,
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
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        statusStore.pushMessage({
          title: `購物車讀取失敗`,
          style: 'danger',
          content: error.data.message,
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

  //變更購物車品項
  const updateCart = async (item) => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    statusStore.loadingItem = item.id
    if (item.qty <= 0) {
      await removeCartItem(item)
      return
    }
    const cart = {
      product_id: item.product_id,
      qty: item.qty,
    }
    const updateCartUrl = `${APIurl}api/${PATHurl}/cart/${item.id}`
    try {
      const response = await axios.put(updateCartUrl, { data: cart })
      if (response.data.success) {
        getCart()
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const contentMsg = Array.isArray(error.response?.data?.message)
          ? error.response.data.message.join('.')
          : error.message || '未知錯誤'
        statusStore.pushMessage({
          title: `商品變更失敗`,
          style: 'danger',
          content: contentMsg,
        })
      } else {
        statusStore.pushMessage({
          title: `商品變更伺服器失敗`,
          style: 'danger',
          content: error.message,
        })
      }
    } finally {
      statusStore.loadingItem = ''
      statusStore.isLoading = false
    }
  }

  //刪除購物車品項
  const removeCartItem = async (item) => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    statusStore.loadingItem = item.id
    const cart = {
      product_id: item.product_id,
      qty: item.qty,
    }
    const deleteCartUrl = `${APIurl}api/${PATHurl}/cart/${item.id}`
    try {
      const response = await axios.delete(deleteCartUrl, { data: cart })
      if (response.data.success) {
        getCart()
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const contentMsg = Array.isArray(error.response?.data?.message)
          ? error.response.data.message.join('.')
          : error.message || '未知錯誤'
        statusStore.pushMessage({
          title: `商品刪除失敗`,
          style: 'danger',
          content: contentMsg,
        })
      } else {
        statusStore.pushMessage({
          title: `商品刪除伺服器失敗`,
          style: 'danger',
          content: error.message,
        })
      }
    } finally {
      statusStore.loadingItem = ''
      statusStore.isLoading = false
    }
  }

  //使用優惠劵
  const useCoupon = async (code) => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    const data = {
      code,
    }
    const deleteCartUrl = `${APIurl}api/${PATHurl}/coupon`
    try {
      const response = await axios.post(deleteCartUrl, { data })
      if (response.data.success) {
        getCart()
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        statusStore.pushMessage({
          title: `優惠劵使用失敗`,
          style: 'danger',
          content: error.response.data.message,
        })
      } else {
        statusStore.pushMessage({
          title: `優惠劵使用伺服器失敗`,
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
    updateCart,
    removeCartItem,
    useCoupon,
  }
})

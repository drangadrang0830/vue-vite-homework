import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { userCart } from '@/api'
import useStatusStore from '@/stores/statusStore'

export default defineStore('userCartStore', () => {
  const cartData = ref({})

  //計算-產品總數
  const cartTotalQuantity = computed(() => {
    return cartData.value.carts?.length || 0
  })

  //讀取購物車
  const getCart = async () => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    try {
      const response = await userCart.get()
      if (response.data.success) {
        cartData.value = response.data.data
      }
    } catch (error) {
      statusStore.handleMessage(error, '讀取購物車')
    } finally {
      statusStore.isLoading = false
    }
  }

  //新增至購物車
  const addCart = async (id, qty = 1) => {
    const statusStore = useStatusStore()
    statusStore.loadingItem = id
    const data = {
      product_id: id,
      qty
    }
    const title = '新增購物車'
    try {
      const response = await userCart.add(data)
      const success = statusStore.handleMessage(response, title)
      if (success) {
        getCart()
      }
    } catch (error) {
      statusStore.handleMessage(error, title)
    } finally {
      statusStore.loadingItem = ''
    }
  }

  //變更購物車內容
  const updateCart = async (item) => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    const title = '數量變更'
    statusStore.loadingItem = item.id
    if (item.qty <= 0) {
      await removeCartItem(item)
      return
    }
    const data = {
      product_id: item.product_id,
      qty: item.qty
    }
    try {
      const response = await userCart.update(item.id, data)
      const success = statusStore.handleMessage(response, title)
      if (success) {
        getCart()
      }
    } catch (error) {
      statusStore.handleMessage(error, title)
    } finally {
      statusStore.loadingItem = ''
      statusStore.isLoading = false
    }
  }

  //刪除購物車品項
  const removeCartItem = async (item) => {
    const statusStore = useStatusStore()
    const title = '刪除商品'
    statusStore.isLoading = true
    statusStore.loadingItem = item.id
    try {
      const response = await userCart.delete(item.id)
      const success = statusStore.handleMessage(response, title)
      if (success) {
        getCart()
      }
    } catch (error) {
      statusStore.handleMessage(error, title)
    } finally {
      statusStore.loadingItem = ''
      statusStore.isLoading = false
    }
  }

  //套用優惠劵
  const useCoupon = async (code) => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    const title = '套用優惠劵'
    try {
      const response = await userCart.useCoupon(code)
      const success = statusStore.handleMessage(response, title)
      if (success) {
        getCart()
      }
    } catch (error) {
      statusStore.handleMessage(error, title)
    } finally {
      statusStore.isLoading = false
    }
  }

  return {
    addCart,
    getCart,
    cartData,
    cartTotalQuantity,
    updateCart,
    removeCartItem,
    useCoupon
  }
})

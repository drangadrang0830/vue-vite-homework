import { ref } from 'vue'
import { adminCoupons } from '@/api'
import { defineStore } from 'pinia'
import useStatusStore from '@/stores/statusStore'

export default defineStore('adminCouponStore', () => {
  const coupons = ref({})
  const pagination = ref({})

  //讀取優惠劵
  const getCoupons = async (page = 1) => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    try {
      const response = await adminCoupons.get(page)
      if (response.data.success) {
        coupons.value = response.data.coupons
        pagination.value = response.data.pagination
      }
    } catch (error) {
      statusStore.handleMessage(error, '取得優惠劵')
    } finally {
      statusStore.isLoading = false
    }
  }

  //刪除優惠劵
  const removeCoupon = async (id) => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    const title = '刪除優惠劵'
    try {
      const response = await adminCoupons.delete(id)
      const success = statusStore.handleMessage(response, title)
      if (success) {
        getCoupons()
        return true
      }
    } catch (error) {
      statusStore.handleMessage(error, title)
      return false
    } finally {
      statusStore.isLoading = false
    }
  }

  // 新增優惠劵
  const addCoupon = async (item) => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    const title = '新增優惠劵'
    try {
      const response = await adminCoupons.add(item)
      const success = statusStore.handleMessage(response, title)
      if (success) {
        getCoupons()
        return true
      }
    } catch (error) {
      statusStore.handleMessage(error, title)
      return false
    } finally {
      statusStore.isLoading = false
    }
  }

  // 編輯優惠劵
  const updateCoupon = async (item) => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    const title = '編輯優惠劵'
    try {
      const response = await adminCoupons.update(item.id, item)
      const success = statusStore.handleMessage(response, title)
      if (success) {
        getCoupons(pagination.value.current_page || 1)
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
    coupons,
    getCoupons,
    removeCoupon,
    addCoupon,
    updateCoupon,
    pagination
  }
})

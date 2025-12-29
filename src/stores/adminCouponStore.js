import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import useStatusStore from '@/stores/statusStore'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH

const couponData = ref({})

export default defineStore('adminCouponStore', () => {
  //讀取優惠劵
  const getCoupon = async (page = 1) => {
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    const url = `${APIurl}api/${PATHurl}/admin/coupons?page=${page}`
    try {
      const response = await axios.get(url)
      if (response.data.success) {
        couponData.value = response.data
      }
    } catch (error) {
      statusStore.handleMessage(error, '取得優惠劵')
    } finally {
      statusStore.isLoading = false
    }
  }

  //刪除優惠劵
  const removeCoupon = async (item) => {
    const statusStore = useStatusStore()
    const url = `${APIurl}api/${PATHurl}/admin/coupon/${item.id}`
    statusStore.isLoading = true
    const title = '刪除優惠劵'
    try {
      const response = await axios.delete(url)
      const success = statusStore.handleMessage(response, title)
      if (success) {
        getCoupon()
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
  const addCoupon = async (data) => {
    const statusStore = useStatusStore()
    const url = `${APIurl}api/${PATHurl}/admin/coupon`
    statusStore.isLoading = true
    const title = '新增優惠劵'
    try {
      const response = await axios.post(url, { data })
      const success = statusStore.handleMessage(response, title)
      if (success) {
        getCoupon()
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
    const url = `${APIurl}api/${PATHurl}/admin/coupon/${item.id}`
    statusStore.isLoading = true
    const title = '編輯優惠劵'
    try {
      const response = await axios.put(url, { data: item })
      const success = statusStore.handleMessage(response, title)
      if (success) {
        getCoupon()
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
    couponData,
    getCoupon,
    removeCoupon,
    addCoupon,
    updateCoupon
  }
})

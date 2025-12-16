import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import useStatusStore from './statusStore'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH

const couponData = ref({})

export default defineStore('couponStore', () => {
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
      if (error.response && error.response.status === 400) {
        statusStore.pushMessage({
          title: `優惠劵讀取失敗`,
          style: 'danger',
          content: error.data.message,
        })
      } else {
        statusStore.pushMessage({
          title: `優惠劵讀取失敗`,
          style: 'danger',
          content: error.message,
        })
      }
    } finally {
      statusStore.isLoading = false
    }
  }

  //刪除優惠劵
  const removeCoupon = async (item) => {
    const statusStore = useStatusStore()
    const url = `${APIurl}api/${PATHurl}/admin/coupon/${item.id}`
    statusStore.isLoading = true
    try {
      const response = await axios.delete(url)
      if (response.data.success) {
        statusStore.pushMessage({
          title: `優惠劵刪除成功`,
          style: 'success',
        })
        getCoupon()
        return true
      }
    } catch (error) {
      statusStore.pushMessage({
        title: `優惠劵刪除伺服器失敗`,
        style: 'danger',
        content: error.message,
      })
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
    try {
      // API 要求的格式需要包裝在 data 屬性內
      const response = await axios.post(url, { data })
      if (response.data.success) {
        statusStore.pushMessage({
          title: `優惠劵新增成功`,
          style: 'success',
        })
        getCoupon() // 重新整理列表
        return true
      }
    } catch (error) {
      statusStore.pushMessage({
        title: `優惠劵新增失敗`,
        style: 'danger',
        content: error.response?.data?.message || error.message,
      })
      return false
    } finally {
      statusStore.isLoading = false
    }
  }

  // 更新優惠劵 (編輯)
  const updateCoupon = async (item) => {
    const statusStore = useStatusStore()
    // 更新 API endpoint 需要帶上 ID
    const url = `${APIurl}api/${PATHurl}/admin/coupon/${item.id}`
    statusStore.isLoading = true
    try {
      // API 要求的格式需要包裝在 data 屬性內
      const response = await axios.put(url, { data: item })
      if (response.data.success) {
        statusStore.pushMessage({
          title: `優惠劵更新成功`,
          style: 'success',
        })
        getCoupon() // 重新整理列表
        return true
      }
    } catch (error) {
      statusStore.pushMessage({
        title: `優惠劵更新失敗`,
        style: 'danger',
        content: error.response?.data?.message || error.message,
      })
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
    updateCoupon,
  }
})

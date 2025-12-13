import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import useStatusStore from './statusStore'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH

const statusStore = useStatusStore()
//Setup Store 設定式寫法
export default defineStore('orderStore', () => {
  const orders = ref([])

  const pagination = ref({})

  //取得產品資訊
  const getOrders = async (page = 1) => {
    const getUrl = `${APIurl}api/${PATHurl}/admin/orders/?page=${page}`
    statusStore.isLoading = true

    try {
      const response = await axios.get(getUrl)
      if (response.data.success) {
        orders.value = response.data.orders
        pagination.value = response.data.pagination
        console.log(orders.value, pagination.value)
        if (response.data.success) {
          statusStore.pushMessage({
            title: `訂單取得成功`,
            style: 'success',
          })
        }
      } else {
        console.log('訂單取得失敗:', response.data.message)
      }
    } catch (error) {
      console.log('訂單取得伺服器失敗回應:', error.message)
    } finally {
      statusStore.isLoading = false
    }
  }

  // -----------------

  //新增/變更函式
  const updateProduct = async (item) => {
    let api = `${APIurl}api/${PATHurl}/admin/product`
    let httpMethod = 'post'
    let msg = '新增'
    if (item.id) {
      api = `${api}/${item.id}`
      httpMethod = 'put'
      msg = '修改'
    }
    try {
      const response = await axios[httpMethod](api, { data: item })

      if (response.data.success) {
        statusStore.pushMessage({
          title: `${item.title}${msg}成功`,
          style: 'success',
        })
        return true
      } else {
        statusStore.pushMessage({
          title: `產品${msg}失敗`,
          style: 'danger',
          content: response.data.message.join('.'),
        })
        return false
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        statusStore.pushMessage({
          title: `產品${msg}失敗`,
          style: 'danger',
          content: error.response.data.message.join('.'),
        })
        return false
      } else {
        statusStore.pushMessage({
          title: `產品${msg}失敗`,
          style: 'danger',
          content: error.message.join('.'),
        })
      }
      return false
    }
  }

  // -----------------

  // 處理檔案上傳的方法
  const uploadFile = async (formData) => {
    const url = `${APIurl}api/${PATHurl}/admin/upload`
    try {
      const response = await axios.post(url, formData)
      if (response.data.success) {
        console.log('上傳圖片成功')
        return response.data.imageUrl
      } else {
        console.log('上傳圖片失敗:', response.data.message)
        return null
      }
    } catch (error) {
      console.log('上傳圖片伺服器失敗:', error)
      return null
    }
  }

  // -----------------

  return {
    orders,
    getOrders,
    updateProduct,
    uploadFile,
    pagination,
  }
})

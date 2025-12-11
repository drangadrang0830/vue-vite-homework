import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH

//Setup Store 設定式寫法
export default defineStore('productsStore', () => {
  const products = ref([])

  //取得產品資訊
  const getProducts = async () => {
    const loginUrl = `${APIurl}api/${PATHurl}/admin/products/all`

    try {
      const response = await axios.get(loginUrl)
      if (response.data.success) {
        products.value = response.data.products
        console.log('產品取得成功')
      } else {
        console.log('產品取得失敗:', response.data.message)
      }
    } catch (error) {
      console.log('產品取得伺服器失敗回應:', error.message)
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
      msg = '修改:'
    }
    try {
      const response = await axios[httpMethod](api, { data: item })

      if (response.data.success) {
        console.log(`產品${msg}成功`)
        return true
      } else {
        console.log(`產品${msg}失敗:`, response.data.message)
        return false
      }
    } catch (error) {
      console.log(`產品${msg}伺服器失敗回應:`, error.message)
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
        console.log('上傳圖片成功', response.data)
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
    products,
    getProducts,
    updateProduct,
    uploadFile,
  }
})

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
        console.log('產品取得成功:', products.value)
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
      // 如果有 ID，表示是修改 (PUT)
      api = `${api}/${item.id}`
      httpMethod = 'put'
      msg = '修改:'
    }
    try {
      const response = await axios[httpMethod](api, { data: item })

      if (response.data.success) {
        console.log(`產品${msg}成功:`, response)
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

  return {
    products,
    getProducts,
    updateProduct,
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import useStatusStore from './statusStore'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH

//Setup Store 設定式寫法
export default defineStore('userHomeStore', () => {
  const userHomeData = ref([])

  //取得首頁圖片資訊(category為單一選項 因後端儲存圖片只能放在產品中)
  const getUserHomeData = async (category) => {
    if (userHomeData.value.length > 0) return
    const title = `${category}讀取`
    const statusStore = useStatusStore()
    const url = `${APIurl}api/${PATHurl}/products/`
    statusStore.isLoading = true
    try {
      const response = await axios.get(url, {
        params: { category },
      })
      userHomeData.value = response.data.products
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      statusStore.pushMessage({
        title: `${title}失敗`,
        style: 'danger',
        content: errorMsg,
      })
    } finally {
      statusStore.isLoading = false
    }
  }

  return {
    userHomeData,
    getUserHomeData,
  }
})

import { defineStore } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router'

const APIurl = import.meta.env.VITE_APP_API

//Setup Store 設定式寫法
export default defineStore('apiStore', () => {
  const router = useRouter()

  //登入 方法
  const login = async (username, password) => {
    const loginUrl = `${APIurl}admin/signin`

    try {
      const response = await axios.post(loginUrl, { username, password })

      if (response.data.success) {
        const { token, expired } = response.data
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`
        // 直接使用上面定義的 router 實例
        router.push('/dashboardview/productsview')
      }
    } catch (error) {
      console.log('登入失敗回應:', error.message)
    }
  }

  // 確認 方法
  const getToken = async () => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')

    if (token) {
      axios.defaults.headers.common.Authorization = token
      const loginUrl = `${APIurl}api/user/check`
      try {
        const response = await axios.post(loginUrl)
        console.log('驗證成功')
        if (!response.data.success) {
          router.push('/loginview')
        }
      } catch (error) {
        console.log('登入失敗回應:', error.message)
        router.push('/loginview')
      }
    } else {
      // this.token = null; // 如果用 ref() 記得更新狀態
      console.log('Cookie 中沒有找到 Token')
    }
  }

  //登出 方法
  const logout = async () => {
    const loginUrl = `${APIurl}logout`

    try {
      const response = await axios.post(loginUrl)

      if (response.data.success) {
        console.log('已登出:', response.data.success)
        router.push('/loginview')
      }
    } catch (error) {
      console.log('登入失敗回應:', error.message)
    }
  }

  // 最後返回所有 state, actions, getters 供外部使用
  return {
    login,
    getToken,
    logout,
    // token // 如果有定義狀態，也要返回
  }
})

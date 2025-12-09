import { defineStore } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router'

const APIurl = import.meta.env.VITE_APP_API

//Setup Store 設定式寫法
export default defineStore('apiStore', () => {
  const router = useRouter()

  const login = async (username, password) => {
    const loginUrl = `${APIurl}v2/admin/signin`

    try {
      const response = await axios.post(loginUrl, { username, password })

      if (response.data.success) {
        const { token, expired } = response.data
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`
        console.log('Token 已成功儲存至 Cookie')

        // 直接使用上面定義的 router 實例
        router.push('/dashboardviews')
      }
    } catch (error) {
      console.error('登入失敗回應:', error.message)
    }
  }

  const getToken = async () => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')

    if (token) {
      axios.defaults.headers.common.Authorization = token
      const loginUrl = `${APIurl}v2/api/user/check`
      try {
        const response = await axios.post(loginUrl)
        console.log(response)
        if (!response.data.success) {
          router.push('/loginviews')
        }
      } catch (error) {
        console.error('登入失敗回應:', error.message)
        router.push('/loginviews')
      }
    } else {
      // this.token = null; // 如果用 ref() 記得更新狀態
      console.error('Cookie 中沒有找到 Token')
    }
  }

  // 最後返回所有 state, actions, getters 供外部使用
  return {
    login,
    getToken,
    // token // 如果有定義狀態，也要返回
  }
})

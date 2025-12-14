import { defineStore } from 'pinia'
import axios from 'axios'
import useStatusStore from '../stores/statusStore'

const APIurl = import.meta.env.VITE_APP_API

//Setup Store 設定式寫法
export default defineStore('apiStore', () => {
  //登入 方法
  const login = async (username, password) => {
    const statusStore = useStatusStore()
    const loginUrl = `${APIurl}admin/signin`

    try {
      statusStore.isLoading = true
      const response = await axios.post(loginUrl, { username, password })
      if (response.data.success) {
        const { token, expired } = response.data
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`
        statusStore.isLoading = true
        return true
      } else {
        statusStore.pushMessage({
          title: `帳號登入失敗`,
          style: 'danger',
          content: response.data.message,
        })
        statusStore.isLoading = true
        return false
      }
    } catch (error) {
      statusStore.pushMessage({
        title: `帳號登入伺服器失敗`,
        style: 'danger',
        content: error.message,
      })
      statusStore.isLoading = true
      return false
    }
  }

  // 確認 方法
  const getToken = async () => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')

    if (token) {
      axios.defaults.headers.common.Authorization = token
      const tokenUrl = `${APIurl}api/user/check`
      try {
        const response = await axios.post(tokenUrl)
        return response.data.success // 只回傳 true/false
      } catch (error) {
        console.log('登入失敗回應:', error.message)
        return false // 失敗回傳 false
      }
    } else {
      console.log('Cookie 中沒有找到 Token')
      return false // 沒有 token 就回傳 false
    }
  }

  //登出 方法
  const logout = async () => {
    const statusStore = useStatusStore()
    const logoutUrl = `${APIurl}logout`

    try {
      const response = await axios.post(logoutUrl)
      if (response.data.success) {
        return true
      }
    } catch (error) {
      console.log('登出失敗回應:', error.message)
      statusStore.pushMessage({
        title: `帳號登出伺服器失敗`,
        style: 'danger',
        content: error.message,
      })
      return false
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

import { defineStore } from 'pinia'
import axios from 'axios'
import useStatusStore from './statusStore'

const APIurl = import.meta.env.VITE_APP_API

export default defineStore('AdminApiStore', () => {
  //登入
  const login = async (username, password) => {
    const statusStore = useStatusStore()
    const url = `${APIurl}admin/signin`

    try {
      statusStore.isLoading = true
      const response = await axios.post(url, { username, password })
      if (response.data.success) {
        const { token, expired } = response.data
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`
        statusStore.isLoading = true
        return true
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      statusStore.pushMessage({
        title: '登入失敗',
        style: 'danger',
        content: errorMsg
      })
      statusStore.isLoading = true
      return false
    }
  }

  // 確認 方法
  const getToken = async () => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
    const statusStore = useStatusStore()

    if (token) {
      axios.defaults.headers.common.Authorization = token
      const url = `${APIurl}api/user/check`
      try {
        const response = await axios.post(url)
        return response.data.success
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message
        statusStore.pushMessage({
          title: '身分認證失敗',
          style: 'danger',
          content: errorMsg
        })
        return false
      }
    } else {
      statusStore.pushMessage({
        title: '缺乏token',
        style: 'danger',
        content: '請重新登入'
      })
      return false
    }
  }

  //登出 方法
  const logout = async () => {
    const statusStore = useStatusStore()
    const url = `${APIurl}logout`

    try {
      const response = await axios.post(url)
      if (response.data.success) {
        return true
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      statusStore.pushMessage({
        title: '登出失敗',
        style: 'danger',
        content: errorMsg
      })
      return false
    }
  }

  return {
    login,
    getToken,
    logout
  }
})

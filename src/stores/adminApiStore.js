import { defineStore } from 'pinia'
import axios from 'axios'
import useStatusStore from '@/stores/statusStore'

const APIurl = import.meta.env.VITE_APP_API

export default defineStore('adminApiStore', () => {
  //登入
  const login = async (username, password) => {
    const statusStore = useStatusStore()
    const url = `${APIurl}admin/signin`
    const title = '登入'
    statusStore.isLoading = true
    try {
      const response = await axios.post(url, { username, password })
      const success = statusStore.handleMessage(response, title)
      if (success) {
        const { token, expired } = response.data
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`
        return true
      }
      return false
    } catch (error) {
      statusStore.handleMessage(error, title)
      return false
    }
  }

  //身分認證
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
        statusStore.handleMessage(error, '身分認證')
        return false
      }
    } else {
      statusStore.pushMessage({ title: '缺乏token', style: 'danger' })
      return false
    }
  }

  //登出
  const logout = async () => {
    const statusStore = useStatusStore()
    const url = `${APIurl}logout`
    try {
      const response = await axios.post(url)
      if (response.data.success) {
        return true
      }
    } catch (error) {
      statusStore.handleMessage(error, '登出')
      return false
    }
  }

  return {
    login,
    getToken,
    logout
  }
})

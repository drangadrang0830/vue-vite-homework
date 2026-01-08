import { defineStore } from 'pinia'
import { adminAuth } from '@/api'
import useStatusStore from '@/stores/statusStore'

export default defineStore('adminApiStore', () => {
  //登入並儲存憑證
  const login = async (username, password) => {
    const statusStore = useStatusStore()
    const title = '登入'
    statusStore.isLoading = true
    try {
      const response = await adminAuth.login({ username, password })
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
    } finally {
      statusStore.isLoading = false
    }
  }

  //身分認證
  const checkLogin = async () => {
    const statusStore = useStatusStore()
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
    if (!token) return false
    try {
      const response = await adminAuth.check()
      return response.data.success
    } catch (error) {
      statusStore.handleMessage(error, '身分認證')
      return false
    } finally {
      statusStore.isLoading = false
    }
  }

  //安全登出
  const logout = async () => {
    const statusStore = useStatusStore()
    try {
      const response = await adminAuth.logout()
      if (response.data.success) {
        document.cookie = 'hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        return true
      }
    } catch (error) {
      statusStore.handleMessage(error, '登出')
      return false
    }
  }

  return {
    login,
    checkLogin,
    logout
  }
})

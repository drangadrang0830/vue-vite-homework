import axios from 'axios'

import { defineStore } from 'pinia'

const APIurl = import.meta.env.VITE_APP_API

export default defineStore('apiStore', {
  state: () => ({
    loginResult: {},
  }),
  getters: {
    // 計算操作
  },
  //async/await版本
  actions: {
    // 1. 在函式宣告前加上 async 關鍵字
    async login(username, password) {
      // 實例化 網路連結
      const loginUrl = `${APIurl}admin/signin`
      //清空存放物件
      this.loginResult = {}
      //嘗試
      try {
        // 2. 在非同步操作前加上 await，程式會在這裡「暫停」等待結果
        const response = await axios.post(loginUrl, { username, password }) // 暫停並等待 API 回應
        // 3. 取得回應後，程式才繼續往下執行
        //解構出資料屬性值
        const { data } = response
        //將該值賦值到物件變數上
        this.loginResult = data
        //提示
        console.log('登入成功回應:', data.message)
        //解構出兩值
        const { token, expired } = data
        //儲存金鑰
        document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`
        //提示
        console.log('Token 已成功儲存至 Cookie')
        // 4. 使用 try-catch 捕捉任何錯誤
      } catch (error) {
        //提示
        console.error('登入失敗回應:', error.message)
      } finally {
        // 5. 無論成功失敗，最後都會執行的區塊，適合放置關閉 Loading 的程式碼
      }
    },
  },
})

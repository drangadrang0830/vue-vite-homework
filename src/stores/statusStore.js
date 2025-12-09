import { defineStore } from 'pinia';

export default defineStore('statusStore', {
  state: () => ({
    //讀取狀態 預設關閉
    isLoading: false,
    //選取對象ID
    cartLoadingItem: '',
    // //狀態紀錄
    messages: [],
  }),
  actions: {//方法
    //使用吐司推出通知 函式
    pushMessage(data) {
      //取出 title, content style 並調整為success字串
      const { title, content, style = 'success' } = data;
      this.messages.push({ style, title, content });
    },
  },
});

import { createApp } from 'vue'
// 引入套件
import { createPinia } from 'pinia'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
//引入頁面
import App from './App.vue'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)
app.mount('#app')

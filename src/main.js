// 1. 核心/框架庫 (Core Libraries)
import { createApp } from 'vue'
// 2. 第三方套件 (Third-party Libraries)
import { createPinia } from 'pinia'
import axios from 'axios'
import VueAxios from 'vue-axios'

// 3. 第三方樣式/副作用引入 (Third-party Styles/Side Effects)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// 4. 專案內部模組/檔案 (Project Local Modules)
import router from './router'
import App from './App.vue'

// 5. 創建應用實例並使用插件
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)

app.mount('#app')

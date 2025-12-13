// 1. 核心/框架庫 (Core Libraries)
import { createApp } from 'vue'
// 2. 第三方套件 (Third-party Libraries)
import { createPinia } from 'pinia'
import axios from 'axios'
import VueAxios from 'vue-axios'

import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

// 3. 第三方樣式/副作用引入 (Third-party Styles/Side Effects)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { currency } from './methods/filters'

// 4. 專案內部模組/檔案 (Project Local Modules)
import router from './router'
import App from './App.vue'

// 5. 創建應用實例並使用插件
const app = createApp(App)
// 新增全域屬性 $filters，並將 currency 方法掛載在其下，任何地方都可以透過 this.$filters.currency(參數) 來使用它
app.config.globalProperties.$filters = {
  currency,
}
app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)
app.component('LoadingOverlay', Loading)

app.mount('#app')

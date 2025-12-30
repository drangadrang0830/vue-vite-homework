// 1. 核心/框架庫
import { createApp } from 'vue'

// 2. 第三方套件與樣式
import { createPinia } from 'pinia'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'default-passive-events'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate'
import { required, email, min, max, alpha_dash } from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'

// 3. 專案內部模組 (使用 @ 路徑別名)
import router from '@/router'
import App from '@/App.vue'
import { currency, date } from '@/methods/filters'

// Vee-Validate 規則
defineRule('required', required)
defineRule('email', email)
defineRule('min', min)
defineRule('alpha_dash', alpha_dash)
defineRule('max', max)

configure({
  generateMessage: localize('zh_TW', zhTW),
  validateOnInput: true
})
setLocale('zh_TW')

// 4. 創建應用實例
const app = createApp(App)
// 掛載全域屬性
app.config.globalProperties.$filters = { currency, date }

// 5. 使用插件
app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)

// 6. 註冊全域組件
app.component('LoadingOverlay', Loading)
app.component('VForm', Form)
app.component('VField', Field)
app.component('ErrorMessage', ErrorMessage)

app.mount('#app')

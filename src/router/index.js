import { createRouter, createWebHashHistory } from 'vue-router'

// 實體化路徑
import loginViews from '../views/loginViews.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'loginViews',
      component: loginViews,
    },
  ],
})

export default router

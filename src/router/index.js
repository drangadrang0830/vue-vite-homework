import { createRouter, createWebHashHistory } from 'vue-router'

// 實體化路徑
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/loginview',
      component: LoginView,
    },
    {
      path: '/dashboardview',
      component: DashboardView,
    },
  ],
})

export default router

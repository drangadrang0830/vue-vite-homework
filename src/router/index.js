import { createRouter, createWebHashHistory } from 'vue-router'

// 實體化路徑
import HomeView from '../views/HomeView.vue'
import LoginViews from '../views/LoginViews.vue'
import DashboardViews from '../views/DashboardViews.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/loginviews',
      component: LoginViews,
    },
    {
      path: '/dashboardviews',
      component: DashboardViews,
    },
  ],
})

export default router

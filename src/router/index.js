import { createRouter, createWebHashHistory } from 'vue-router'
import useApiStore from '@/stores/apiStore'

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
      meta: { requiresAuth: true },
      children: [
        {
          path: 'productsview',
          component: () => import('../views/ProductsView.vue'),
        },
      ],
    },
  ],
})

// **變更 3: 添加全域前置守衛**
router.beforeEach(async (to, from, next) => {
  // 實例化您的 Store
  const apiStore = useApiStore()

  // 檢查目標路由是否需要驗證
  if (to.meta.requiresAuth) {
    // 如果需要，就等待 getToken() 執行完畢
    await apiStore.getToken()

    // getToken() 內部已經有導向 loginview 的邏輯了，
    // 所以這裡確保執行完畢後，直接放行到目標頁面
    next()
  } else {
    // 如果不需要驗證 (例如 HomeView, LoginView)，則直接前往
    next()
  }
})

export default router

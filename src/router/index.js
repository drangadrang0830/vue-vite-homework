import { createRouter, createWebHashHistory } from 'vue-router'
import useApiStore from '@/stores/apiStore'

// 實體化路徑
import UserLayout from '../views/UserLayout.vue'
import UserHome from '../views/UserHome.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import UserboardView from '../views/UserboardView.vue'
import UserProductView from '../views/UserProductView.vue'
import UserCartView from '../views/UserCartView.vue'
import UserCheckOut from '../views/UserCheckout.vue'
import UserAttractions from '../views/UserAttractions.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: UserLayout,
      children: [
        {
          path: '',
          component: UserHome,
        },
        {
          path: 'Attractions',
          component: UserAttractions,
        },
        {
          path: 'user',
          component: UserboardView,
          children: [
            {
              path: 'product/:productId',
              component: UserProductView,
            },
            {
              path: 'cart',
              component: UserCartView,
            },
            {
              path: 'checkout/:orderId',
              component: UserCheckOut,
            },
          ],
        },
      ],
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
        {
          path: 'ordersview',
          component: () => import('../views/OrdersView.vue'),
        },
        {
          path: 'couponview',
          component: () => import('../views/CouponView.vue'),
        },
      ],
    },
  ],
})

// 路由表 (修改後)
router.beforeEach(async (to, from, next) => {
  const apiStore = useApiStore()

  if (to.meta.requiresAuth) {
    const isAuthenticated = await apiStore.getToken() // 取得回傳的布林值

    if (isAuthenticated) {
      next() // 驗證成功，放行
    } else {
      next('/loginview') // 驗證失敗，導向登入頁
    }
  } else {
    next()
  }
})

export default router

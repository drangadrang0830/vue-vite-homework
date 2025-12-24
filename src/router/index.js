import { createRouter, createWebHashHistory } from 'vue-router'
import useApiStore from '@/stores/apiStore'

// 實體化路徑
import UserLayout from '../views/UserLayout.vue'
import UserHome from '../views/UserHome.vue'
import UserProductsView from '../views/UserProductsView.vue'
import UserProductView from '../views/UserProductDescriptionView.vue'
import UserCartView from '../views/UserCartView.vue'
import UserFavoriteView from '../views/UserFavoriteView.vue'
import UserProgress from '@/views/UserProgress.vue'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import UserboardView from '../views/UserboardView.vue'

import UserCheckOut from '../views/UserCheckout.vue'
import UserAttractions from '../views/UserAttractions.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      //用戶端
      path: '/',
      component: UserLayout,
      children: [
        {
          path: '',
          component: UserHome
        },
        {
          path: 'Attractions',
          component: UserAttractions
        },
        {
          path: 'products',
          component: UserProgress,
          children: [
            {
              path: '',
              component: UserProductsView
            },
            {
              path: 'product/:productId',
              component: UserProductView
            },
            {
              path: 'cart',
              component: UserCartView
            },
            {
              path: 'favorite',
              component: UserFavoriteView
            },
            {
              path: 'checkout/:orderId',
              component: UserCheckOut
            }
          ]
        },

        {
          path: 'user',
          component: UserboardView,
          children: []
        }
      ]
    },
    {
      path: '/loginview',
      component: LoginView
    },
    {
      path: '/dashboardview',
      component: DashboardView,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'productsview',
          component: () => import('../views/ProductsView.vue')
        },
        {
          path: 'ordersview',
          component: () => import('../views/OrdersView.vue')
        },
        {
          path: 'couponview',
          component: () => import('../views/CouponView.vue')
        }
      ]
    },
    //重新導向回首頁
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// 路由守衛
router.beforeEach(async (to, from, next) => {
  const apiStore = useApiStore()

  if (to.meta.requiresAuth) {
    const isAuthenticated = await apiStore.getToken()

    if (isAuthenticated) {
      next()
    } else {
      next('/loginview')
    }
  } else {
    next()
  }
})

export default router

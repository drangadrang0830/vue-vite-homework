import { createRouter, createWebHashHistory } from 'vue-router'
import useAdminApiStore from '@/stores/AdminApiStore'

// 實體化路徑
import UserLayout from '../views/UserLayout.vue'
import UserHome from '../views/UserHomeView.vue'
import UserProducts from '../views/UserProductsView.vue'
import UserProduct from '../views/UserProductDescriptionView.vue'
import UserCart from '../views/UserCartView.vue'
import UserFavorite from '../views/UserFavoriteView.vue'
import UserProgress from '@/views/UserProgress.vue'
import UserOrder from '@/views/UserOrderView.vue'
import AdminLogin from '../views/AdminLogin.vue'

import DashboardView from '../views/DashboardView.vue'

import UserCheckOut from '../views/UserCheckoutView.vue'
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
          path: 'attractions',
          component: UserAttractions
        },
        {
          path: 'products',
          component: UserProgress,
          children: [
            {
              path: '',
              component: UserProducts
            },
            {
              path: 'product/:productId',
              component: UserProduct
            },
            {
              path: 'favorite',
              component: UserFavorite
            },
            {
              path: 'cart',
              component: UserCart
            },
            {
              path: 'order',
              component: UserOrder
            },
            {
              path: 'checkout/:orderId',
              component: UserCheckOut,
              beforeEnter: (to, from, next) => {
                if (from.path === '/products/order') {
                  next()
                } else {
                  next('/products')
                }
              }
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      component: AdminLogin
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
  const AdminApiStore = useAdminApiStore()

  if (to.meta.requiresAuth) {
    const isAuthenticated = await AdminApiStore.getToken()

    if (isAuthenticated) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router

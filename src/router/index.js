import { createRouter, createWebHashHistory } from 'vue-router'
import useAdminApiStore from '@/stores/adminApiStore'

// 實體化路徑
import UserLayout from '@/views/UserLayout.vue'
import UserHome from '@/views/UserHomeView.vue'
import UserAttractions from '@/views/UserAttractions.vue'
import UserProgress from '@/views/UserProgress.vue'
import UserProducts from '@/views/UserProductsView.vue'
import UserProduct from '@/views/UserProductDescriptionView.vue'
import UserFavorite from '@/views/UserFavoriteView.vue'
import UserCart from '@/views/UserCartView.vue'
import UserOrder from '@/views/UserOrderView.vue'
import UserCheckOut from '@/views/UserCheckoutView.vue'
import AdminLogin from '@/views/AdminLogin.vue'
import AdminLayout from '@/views/AdminLayout.vue'
import AdminProductsView from '@/views/AdminProductsView.vue'
import AdminArticleView from '@/views/AdminArticleView.vue'
import AdminOrdersView from '@/views/AdminOrdersView.vue'
import AdminCouponView from '@/views/AdminCouponView.vue'

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
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: AdminProductsView
        },
        {
          path: 'article',
          component: AdminArticleView
        },
        {
          path: 'orders',
          component: AdminOrdersView
        },
        {
          path: 'coupon',
          component: AdminCouponView
        }
      ]
    },
    //重新導向回首頁
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  //過畫面回到最上方
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守衛
router.beforeEach(async (to, from, next) => {
  const adminApiStore = useAdminApiStore()

  if (to.meta.requiresAuth) {
    const isAuthenticated = await adminApiStore.getToken()

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

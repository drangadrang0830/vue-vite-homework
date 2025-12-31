import { createRouter, createWebHashHistory } from 'vue-router'
import useAdminApiStore from '@/stores/adminApiStore'

// 實體化路徑
const UserLayout = () => import('@/views/UserLayout.vue')
const UserHome = () => import('@/views/UserHomeView.vue')
const UserAttractions = () => import('@/views/UserAttractions.vue')
const UserProgress = () => import('@/views/UserProgress.vue')
const UserProducts = () => import('@/views/UserProductsView.vue')
const UserProduct = () => import('@/views/UserProductDescriptionView.vue')
const UserFavorite = () => import('@/views/UserFavoriteView.vue')
const UserCart = () => import('@/views/UserCartView.vue')
const UserOrder = () => import('@/views/UserOrderView.vue')
const UserCheckOut = () => import('@/views/UserCheckoutView.vue')
const AdminLogin = () => import('@/views/AdminLogin.vue')
const AdminLayout = () => import('@/views/AdminLayout.vue')
const AdminProductsView = () => import('@/views/AdminProductsView.vue')
const AdminArticleView = () => import('@/views/AdminArticleView.vue')
const AdminOrdersView = () => import('@/views/AdminOrdersView.vue')
const AdminCouponView = () => import('@/views/AdminCouponView.vue')

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

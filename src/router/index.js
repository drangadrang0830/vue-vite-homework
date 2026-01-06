import { createRouter, createWebHashHistory } from 'vue-router'
import useAdminApiStore from '@/stores/backend/adminApiStore'

// 實體化路徑
const UserLayout = () => import('@/views/frontend/UserLayout.vue')
const UserHome = () => import('@/views/frontend/UserHomeView.vue')
const UserAttractions = () => import('@/views/frontend/UserAttractions.vue')
const UserProgress = () => import('@/views/frontend/UserProgress.vue')
const UserProducts = () => import('@/views/frontend/UserProductsView.vue')
const UserProduct = () => import('@/views/frontend/UserProductDescriptionView.vue')
const UserFavorite = () => import('@/views/frontend/UserFavoriteView.vue')
const UserCart = () => import('@/views/frontend/UserCartView.vue')
const UserOrder = () => import('@/views/frontend/UserOrderView.vue')
const UserCheckOut = () => import('@/views/frontend/UserCheckoutView.vue')
const AdminLogin = () => import('@/views/backend/AdminLogin.vue')
const AdminLayout = () => import('@/views/backend/AdminLayout.vue')
const AdminProductsView = () => import('@/views/backend/AdminProductsView.vue')
const AdminArticleView = () => import('@/views/backend/AdminArticleView.vue')
const AdminOrdersView = () => import('@/views/backend/AdminOrdersView.vue')
const AdminCouponView = () => import('@/views/backend/AdminCouponView.vue')

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

  if (to.path === '/login' || to.matched.some((record) => record.path.startsWith('/admin'))) {
    document.documentElement.removeAttribute('data-bs-theme')
  } else {
    const userTheme = localStorage.getItem('selected-theme') || 'dark'
    document.documentElement.setAttribute('data-bs-theme', userTheme)
  }

  if (to.meta.requiresAuth) {
    const isAuthenticated = await adminApiStore.checkLogin()

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

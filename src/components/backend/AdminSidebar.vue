<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useAdminApiStore from '@/stores/backend/adminApiStore'

const adminApiStore = useAdminApiStore()
const router = useRouter()

const isNavOpen = ref(false)
const toggleNav = () => { isNavOpen.value = !isNavOpen.value }

//預設連結陣列
const menuItems = ref([
  { name: '產品管理', path: '/admin', icon: 'bi-box-seam' },
  { name: '文章管理', path: '/admin/article', icon: 'bi-journal-text' },
  { name: '訂單列表', path: '/admin/orders', icon: 'bi-receipt' },
  { name: '優惠券', path: '/admin/coupon', icon: 'bi-ticket-perforated' },
])

//登出案件事件
const handleLogout = async () => {
  isNavOpen.value = false
  await adminApiStore.logout()
  router.push('/login')
}

</script>

<template>
  <div class="sidebar d-none d-lg-flex flex-column flex-shrink-0 p-3 text-white bg-dark sticky-top">
    <div class="fs-5 mb-3 px-2 fw-semibold tracking-wider text-uppercase border-start border-3 border-white">
      後台管理系統
    </div>
    <ul class="nav nav-pills flex-column mb-auto">
      <li v-for="item in menuItems" :key="item.path" class="nav-item">
        <RouterLink :to="item.path" class="nav-link link-light" active-class="active-item">
          <i class="bi me-2" :class="item.icon"></i> {{ item.name }}
        </RouterLink>
      </li>
    </ul>
    <div class="mt-auto pt-3 border-top border-secondary">
      <ul class="nav nav-pills flex-column gap-1">
        <li class="mt-2 border border-light text-center">
          <a href="#" @click.prevent="handleLogout" class="nav-link link-warning py-1 px-2 fs-5">
            <i class="bi bi-box-arrow-right me-2"></i>安全登出
          </a>
        </li>
        <li class="mt-2 border border-light text-center">
          <RouterLink to="/" class="nav-link link-info py-1 px-2 fs-5 small">
            <i class="bi bi-arrow-left me-2"></i>返回前台
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
  <nav class="navbar navbar-dark bg-dark d-lg-none fixed-top border-bottom border-secondary">
    <div class="container-fluid">
      <span class="navbar-brand fs-6 fw-bold">後台管理系統</span>
      <button class="navbar-toggler border-0" type="button" @click="toggleNav">
        <span class="navbar-toggler-icon" />
      </button>

      <div class="collapse navbar-collapse" :class="{ 'show': isNavOpen }">
        <ul class="navbar-nav p-3">
          <li v-for="item in menuItems" :key="item.path" class="nav-item">
            <RouterLink :to="item.path" class="nav-link link-light" active-class="text-white"
              @click="isNavOpen = false">
              {{ item.name }}
            </RouterLink>
          </li>
          <li class="nav-item mt-3 pt-3 border-top border-secondary">
            <a class="nav-link link-warning mt-2" href="#" @click.prevent="handleLogout">登出系統</a>
            <RouterLink class="nav-link link-info" to="/" @click="isNavOpen = false">返回前台</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
}

.RouterLink-exact-active {
  font-weight: bold;
  text-shadow: 0 0 5px #fff,
    0 0 10px #42b883,
    0 0 15px #42b883;
}

.navbar-brand:active,
.navbar-brand:focus,
.nav-link:active,
.nav-link:focus {
  text-shadow: 0 0 5px #fff,
    0 0 5px #00BCD4,
    0 0 10px #00BCD4;
}
</style>

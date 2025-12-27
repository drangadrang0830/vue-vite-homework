<script setup>
import { ref } from 'vue';//test
import { useRouter } from 'vue-router'
import useAdminApiStore from '../stores/adminApiStore'

const adminApiStore = useAdminApiStore()
const router = useRouter();
const isNavOpen = ref(false);//test

const toggleNav = () => { //test
  isNavOpen.value = !isNavOpen.value;
};

const handleLogout = async () => {
  const logoutSuccess = await adminApiStore.logout();
  if (logoutSuccess || !logoutSuccess) {
    router.push('/login');
  }
}

</script>

<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">返回首頁</router-link>

        <button class="navbar-toggler" type="button" @click="toggleNav" :aria-expanded="isNavOpen ? 'true' : 'false'"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" :class="{ 'show': isNavOpen }" id="navbarNavDropdown">
          <ul class="navbar-nav w-100">
            <li class="nav-item">
              <router-link class="nav-link" to="/admin" @click="isNavOpen = false">文章</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboardview/productsview" @click="isNavOpen = false">產品</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboardview/ordersview" @click="isNavOpen = false">訂單</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboardview/couponview" @click="isNavOpen = false">優惠劵</router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="handleLogout" @click="isNavOpen = false">登出</a>
            </li>
            <li class="nav-item ms-auto">
              <router-link class="nav-link" to="/user/products" @click="isNavOpen = false">購物車</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

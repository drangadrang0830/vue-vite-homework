<script setup>
import { ref, onMounted } from 'vue'

const isNavOpen = ref(false)

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value
}

// 初始化主題
const theme = ref(localStorage.getItem('selected-theme') || 'dark')

// 切換主題的函式
const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-bs-theme', theme.value)
  localStorage.setItem('selected-theme', theme.value)
}

// 創建套用主題
onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', theme.value)
})
</script>

<style scoped>
.router-link-active {
  font-weight: bold;
}
</style>

<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div class="container-fluid">
        <!-- 首頁 -->
        <router-link class="navbar-brand" to="/">獅子鄉聯合行銷網</router-link>

        <!-- 切換模式按鈕 -->
        <div class="d-flex ms-auto me-2 order-lg-last">
          <button class="btn btn-sm btn-outline-secondary border-0" @click="toggleTheme" title="切換深淺色">
            <span v-if="theme === 'dark'">☀️</span>
            <span v-else>🌙</span>
          </button>
        </div>

        <!-- 漢堡按鈕 -->
        <button class="navbar-toggler" type="button" @click="toggleNav" :aria-expanded="isNavOpen ? 'true' : 'false'"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- 連結 -->
        <div class="collapse navbar-collapse" :class="{ 'show': isNavOpen }" id="navbarNavDropdown">
          <ul class="navbar-nav w-100">
            <li class="nav-item">
              <router-link class="nav-link" to="/user" @click="isNavOpen = false">景區介紹</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/user/cart" @click="isNavOpen = false">農業特產</router-link>
            </li>
            <!-- 作業版才有 正式應移除 -->
            <li class="nav-item  ms-auto">
              <router-link class="nav-link" to="/loginview" @click="isNavOpen = false">後台登入</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

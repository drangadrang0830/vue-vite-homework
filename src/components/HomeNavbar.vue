<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

// NAVBAR控制
const isNavOpen = ref(false)

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value
}

const navbarRef = ref(null)

const updateNavbarHeight = () => {
  if (navbarRef.value) {
    const height = navbarRef.value.offsetHeight
    document.documentElement.style.setProperty('--nav-height', `${height}px`)
  }
}

onMounted(() => {
  updateNavbarHeight()
  window.addEventListener('resize', updateNavbarHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateNavbarHeight)
})

watch(isNavOpen, async () => {
  await nextTick()
  updateNavbarHeight()
})
// --------------------------------
// 主題控制
const theme = ref(localStorage.getItem('selected-theme') || 'dark')

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-bs-theme', theme.value)
  localStorage.setItem('selected-theme', theme.value)
}

onMounted(() => {
  document.documentElement.setAttribute('data-bs-theme', theme.value)
})
</script>

<style scoped>
.router-link-exact-active {
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

<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top border-bottom border-2 border-success-subtle"
      ref="navbarRef">
      <div class="container-fluid">
        <router-link class="navbar-brand link-body-emphasis" to="/">獅子鄉聯合行銷網</router-link>
        <div class="d-flex ms-auto me-2 order-lg-last">
          <button class="btn btn-sm btn-outline-secondary border-0" @click="toggleTheme" title="切換深淺色">
            <span v-if="theme === 'dark'">🌞</span>
            <span v-else>🌛</span>
          </button>
        </div>

        <!-- 漢堡按鈕 -->
        <button class="navbar-toggler" type="button" @click="toggleNav" :aria-expanded="isNavOpen ? 'true' : 'false'"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" :class="{ 'show': isNavOpen }" id="navbarNavDropdown">
          <ul class="navbar-nav text-center">
            <li class="nav-item">
              <router-link class="nav-link link-body-emphasis" to="/Attractions"
                @click="isNavOpen = false">景點介紹</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link link-body-emphasis" to="/user/cart"
                @click="isNavOpen = false">農業特產</router-link>
            </li>
            <!-- 作業版才有 正式應移除 -->
            <li class="nav-item ">
              <router-link class="nav-link link-body-emphasis" to="/loginview"
                @click="isNavOpen = false">後台登入</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import useUserCartStore from '@/stores/frontend/userCartStore'

const userCartStore = useUserCartStore()

onMounted(() => {
  updateNavbarHeight()
  window.addEventListener('resize', updateNavbarHeight)
  document.documentElement.setAttribute('data-bs-theme', theme.value)
  userCartStore.getCart()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateNavbarHeight)
})

// NAVBAR控制區-----------
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

</script>

<style scoped>
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

.RouterLink-exact-active .badge {
  text-shadow: none;
}

.location-setting {
  top: -17%;
  left: 95%;
  font-size: 0.6rem;
}

.btn-animate-pulse3 {
  animation: btn-pulse-effect 3s infinite;
}

@keyframes btn-pulse-effect {
  0% {
    box-shadow: 0 0 0 0 rgba(235, 4, 4, 0.7);
  }

  70% {
    box-shadow: 0 0 0 10px rgba(170, 19, 19, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(54, 12, 12, 0);
  }

}
</style>

<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary fixed-top border-bottom border-2 border-success-subtle"
      ref="navbarRef">
      <div class="container-fluid">

        <button class="navbar-toggler" type="button" @click="toggleNav" :aria-expanded="isNavOpen ? 'true' : 'false'"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <RouterLink class="navbar-brand link-body-emphasis d-lg-none d-block ms-2" to="/">
          <img src="/favicon.png" alt="Logo" width="25" height="24" class="d-inline-block align-text-top">
          獅子鄉<span class="d-none d-md-inline">聯合</span>行銷網
        </RouterLink>

        <div class="d-flex ms-auto me-2 order-lg-last">
          <a class="btn btn-danger btn-sm rounded-5 btn-animate-pulse3 me-2" href="tel:+886987654321"><i
              class="bi bi-telephone-fill"></i><span class="d-none d-lg-inline">部落協助</span></a>

          <button class="btn btn-sm btn-outline-secondary border-0" type="button" @click="toggleTheme" title="切換深淺色">
            <span v-if="theme === 'dark'">🌞</span>
            <span v-else>🌛</span>
          </button>
        </div>

        <div class="collapse navbar-collapse" :class="{ 'show': isNavOpen }" id="navbarNavDropdown">
          <ul class="navbar-nav text-center  w-100 justify-content-lg-center align-items-center">
            <li class="nav-item">
              <RouterLink class="nav-link link-body-emphasis mx-3" to="/attractions" @click="isNavOpen = false">景點介紹
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link link-body-emphasis mx-3" to="/products" @click="isNavOpen = false">農業特產
              </RouterLink>
            </li>
            <RouterLink class="navbar-brand link-body-emphasis d-lg-block d-none" to="/">
              <img src="/favicon.png" alt="Logo" width="25" height="24" class="d-inline-block align-text-top">
              獅子鄉<span class="d-none d-md-inline">聯合</span>行銷網
            </RouterLink>
            <li class="nav-item">
              <RouterLink class="nav-link link-body-emphasis mx-3" to="/products/favorite" @click="isNavOpen = false">
                我的最愛
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link link-body-emphasis mx-3" to="/products/cart" @click="isNavOpen = false">
                <span class="position-relative">購物車
                  <span class="position-absolute location-setting badge rounded-pill bg-danger"
                    v-if="userCartStore.cartTotalQuantity > 0">{{ userCartStore.cartTotalQuantity }}</span>
                </span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

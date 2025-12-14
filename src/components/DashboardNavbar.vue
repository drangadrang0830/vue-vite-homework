<script setup>
import { ref } from 'vue';//test
import { useRouter } from 'vue-router'
import useApiStore from '../stores/apiStore'

const apiStore = useApiStore()
const router = useRouter();
const isNavOpen = ref(false);//test

const toggleNav = () => { //test
  isNavOpen.value = !isNavOpen.value;
};

const handleLogout = async () => {
  // 呼叫 apiStore 的登出方法（它現在應該只負責清除後端 session 和 cookie）
  const logoutSuccess = await apiStore.logout();

  if (logoutSuccess || !logoutSuccess) { // 即使後端登出失敗，前端也應該強制跳轉回登入頁
    router.push('/loginview');
  }
}

</script>

<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">返回首頁</router-link>

        <!-- 移除 data-* 屬性，改用 @click 綁定 Vue 方法，並綁定 aria-expanded 和 class -->
        <button class="navbar-toggler" type="button" @click="toggleNav" :aria-expanded="isNavOpen ? 'true' : 'false'"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- 使用 :class 動態綁定 Bootstrap 的 'show' class -->
        <div class="collapse navbar-collapse" :class="{ 'show': isNavOpen }" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item">
              <!-- 點擊 router-link 後自動關閉選單，增加使用者體驗 -->
              <router-link class="nav-link" to="/dashboardview/productsview" @click="isNavOpen = false">產品</router-link>
            </li>
            <li class="nav-item">
              <!-- 點擊 router-link 後自動關閉選單，增加使用者體驗 -->
              <router-link class="nav-link" to="/dashboardview/ordersview" @click="isNavOpen = false">訂單</router-link>
            </li>
            <li class="nav-item">
              <!-- 點擊 router-link 後自動關閉選單，增加使用者體驗 -->
              <router-link class="nav-link" to="/dashboardview/couponview" @click="isNavOpen = false">優惠劵</router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="handleLogout" @click="isNavOpen = false">登出</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

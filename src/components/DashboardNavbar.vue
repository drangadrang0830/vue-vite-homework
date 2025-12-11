<script setup>
import { ref } from 'vue';//test

import store from '../stores/apiStore'

const apiStore = store()

const isNavOpen = ref(false);//test

const toggleNav = () => { //test
  isNavOpen.value = !isNavOpen.value;
};


</script>

<template>
  <div>
    <!-- <nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">返回首頁</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboardview/productsview">產品列表</router-link>
            </li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                待開發
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">待開發1</a></li>
                <li><a class="dropdown-item" href="#">待開發2</a></li>
                <li><a class="dropdown-item" href="#">待開發3</a></li>
              </ul>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="apiStore.logout">登出</a>
            </li>
          </ul>
        </div>
      </div>
    </nav> -->

    <!-- test -->
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
              <router-link class="nav-link" to="/dashboardview/productsview"
                @click="isNavOpen = false">產品列表</router-link>
            </li>

            <li class="nav-item dropdown">
              <!-- 下拉選單開關也需要手動控制狀態或使用 Bootstrap JS -->
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                待開發
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" @click="isNavOpen = false" href="#">待開發1</a></li>
                <li><a class="dropdown-item" @click="isNavOpen = false" href="#">待開發2</a></li>
                <li><a class="dropdown-item" @click="isNavOpen = false" href="#">待開發3</a></li>
              </ul>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="apiStore.logout">登出</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

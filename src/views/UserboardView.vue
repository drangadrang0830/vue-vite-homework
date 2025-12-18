<script setup>
import { ref } from 'vue';
import ToastMessages from '../components/ToastMessages.vue';


const isNavOpen = ref(false);

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value;
};
</script>

<template>
  <div>
    <ToastMessages></ToastMessages>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/user">
          <img src="../../public/favicon2.ico" alt="" width="25" height="30"
            class="d-inline-block align-text-top">獅子鄉聯合行銷網</router-link>

        <button class="navbar-toggler" type="button" @click="toggleNav" :aria-expanded="isNavOpen ? 'true' : 'false'"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" :class="{ 'show': isNavOpen }" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/user/cart" @click="isNavOpen = false">購物車</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container-fluid">
      <router-view></router-view>
    </div>
  </div>
</template>

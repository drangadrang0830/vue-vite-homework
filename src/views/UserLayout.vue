<script setup>
import Navbar from '../components/HomeNavbar.vue'
</script>

<style scoped>
.LayoutBackground {
  background-image: url('../assets/Layout-Background.jpg');
}
</style>

<template>
  <!-- 封存class="LayoutBackground" -->
  <div>
    <Navbar></Navbar>
    <router-view></router-view>
    <div class="footer">
      <div class="text-center text-white py-4" style="background: #3A3A3A;">
        <p class="mb-0">Copyright © 2025 范智聖 練習作品 Rights Reserved.</p>
      </div>
    </div>
  </div>
</template>

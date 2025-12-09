<script setup>

</script>

<template>
  <router-link to="/">首頁</router-link>
  <router-link to="/loginviews">登入</router-link>
  <router-link to="/dashboardviews">儀錶板</router-link>
  <router-view></router-view>
</template>

<style lang="scss">
@import "./assets/all";
</style>

<style>
body {
  font-family: 'Noto Sans TC', 'Noto Sans', sans-serif;
}
</style>

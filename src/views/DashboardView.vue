<script setup>
import Navbar from '../components/DashboardNavbar.vue';

</script>

<template>
  <div>
    <Navbar></Navbar>
    <div class="container-fluid">
      <router-view></router-view>
    </div>
  </div>
</template>

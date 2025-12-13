<script setup>
// import provide from 'vue';
// import emitter from '../methods/emitter';
import Navbar from '../components/DashboardNavbar.vue';
import ToastMessages from '../components/ToastMessages.vue';

// provide('emitter', emitter)
</script>

<template>
  <div>
    <Navbar></Navbar>
    <ToastMessages></ToastMessages>
    <div class="container-fluid">
      <router-view></router-view>
    </div>
  </div>
</template>

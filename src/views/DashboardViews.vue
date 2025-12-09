<template>
  Dashboard
</template>

<script setup>
import { onMounted } from 'vue';
import useApiStore from '@/stores/apiStore';

const apiStore = useApiStore();

//創造階段啟用
onMounted(() => {
  // 當元件掛載到 DOM 時，呼叫 action 來讀取 token
  apiStore.getToken();
});
</script>

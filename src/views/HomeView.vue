<script setup>
import { onMounted } from 'vue';
const url = import.meta.env.VITE_APP_API
const Path = import.meta.env.VITE_APP_PATH

onMounted(() => { console.log(url, Path) })
</script>

<template>
  <h2>當前 API 端點: <strong>{{ url || '未定義' }}</strong></h2>
  <h2>當前 API 路徑: <strong>{{ Path || '未定義' }}</strong></h2>
</template>

<!-- 吐司推出 -->
<template>
  <div class="toast-container position-absolute pe-3 top-0 end-0 mt-4" style="z-index: 1050">
    <toastFormat v-for="(msg, key) in messages" :key="key" :msg="msg" />
  </div>
</template>

<!-- 使用 <script setup> 語法 -->
<script setup>
import { storeToRefs } from 'pinia';
// 引入 Toast 元件，在 <script setup> 中會自動註冊
import toastFormat from './ToastFormat.vue';
import statusStore from '../stores/statusStore';

const status = statusStore();
const { messages } = storeToRefs(status);

</script>

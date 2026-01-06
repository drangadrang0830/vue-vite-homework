<script setup>
import { storeToRefs } from 'pinia'
import toastFormat from '@/components/shared/ToastFormat.vue'
import useStatusStore from '@/stores/statusStore'

const statusStore = useStatusStore()
const { messages } = storeToRefs(statusStore)

</script>

<template>
  <div class="toast-container position-fixed pt-3 pe-3 top-0 end-0 mt-5" style="z-index: 1060">
    <toastFormat v-for="msg in messages" :key="msg.id" :msg="msg" />
  </div>
</template>

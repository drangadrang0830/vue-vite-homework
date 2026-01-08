<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import Toast from 'bootstrap/js/dist/toast'
import useStatusStore from '@/stores/statusStore'

//接收變數
const props = defineProps(['msg'])
const toastEl = ref(null)
const statusStore = useStatusStore()
let bsToastInstance = null

onMounted(() => {
  const toastDomElement = toastEl.value

  bsToastInstance = new Toast(toastDomElement, {
    delay: 3000,
  })

  bsToastInstance.show()

  const handleHidden = () => {
    setTimeout(() => {
      statusStore.removeMessage(props.msg.id)
    }, 10)
  }

  toastDomElement.addEventListener('hidden.bs.toast', handleHidden)

  onUnmounted(() => {
    if (toastDomElement && handleHidden) {
      toastDomElement.removeEventListener('hidden.bs.toast', handleHidden)
    }
    if (bsToastInstance) {
      bsToastInstance.dispose()
    }
  })
})

</script>

<style scoped>
.toast {
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.toast-header.bg-success {
  background-color: #198754;
  border-bottom: none;
}

.toast-body {
  font-size: 0.9rem;
}
</style>

<template>
  <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" ref="toastEl">
    <div class="toast-header">
      <span :class="`bg-${props.msg.style}`" class="p-2 rounded me-2 d-inline-block"></span>
      <strong class="me-auto">{{ props.msg.title }}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body" v-if="props.msg.content">
      {{ props.msg.content }}
    </div>
  </div>
</template>

<!-- 吐司格式 -->
<template>
  <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" ref="toastEl">
    <div class="toast-header">
      <!-- 使用 props.msg 存取傳入的訊息 -->
      <span :class="`bg-${props.msg.style}`" class="p-2 rounded me-2 d-inline-block"></span>
      <strong class="me-auto">{{ props.msg.title }}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body" v-if="props.msg.content">
      {{ props.msg.content }}
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import Toast from 'bootstrap/js/dist/toast';
import useStatusStore from '../stores/statusStore'

const props = defineProps(['msg']);
const toastEl = ref(null);
const statusStore = useStatusStore()
let bsToastInstance = null; // 用於存放 Bootstrap Toast 實例

onMounted(() => {
  const toastDomElement = toastEl.value;

  // 實例化 Bootstrap Toast
  bsToastInstance = new Toast(toastDomElement, {
    delay: 3000,
  });

  bsToastInstance.show();

  // 添加監聽器，並將事件處理函數抽出，方便移除
  const handleHidden = () => {
    setTimeout(() => {
      statusStore.removeMessage(props.msg.id);
    }, 10);
  };

  toastDomElement.addEventListener('hidden.bs.toast', handleHidden);

  // 在元件卸載前，手動移除事件監聽器和銷毀 Bootstrap Toast 實例
  onUnmounted(() => {
    if (toastDomElement && handleHidden) {
      toastDomElement.removeEventListener('hidden.bs.toast', handleHidden);
    }
    if (bsToastInstance) {
      bsToastInstance.dispose(); // 銷毀 Bootstrap 實例
    }
  });
});

</script>

<style scoped>
/* 增加圓角、陰影，讓吐司看起來更精緻 */
.toast {
  border-radius: 0.5rem;
  /* 增加圓角 */
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  /* 增加陰影 */
  overflow: hidden;
  /* 確保內容不會超出圓角邊界 */
  /* 可以增加過渡動畫讓出現更流暢，但 Bootstrap 已有內建動畫 */
}

/* 如果使用方向一的 bg-primary 等類別，這裡可以讓 header 更協調 */
.toast-header.bg-success {
  background-color: #198754;
  /* 確保顏色符合您的設計 */
  border-bottom: none;
}

.toast-body {
  font-size: 0.9rem;
}
</style>

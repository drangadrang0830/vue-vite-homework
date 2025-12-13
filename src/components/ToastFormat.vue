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
import { onMounted, ref } from 'vue';
import Toast from 'bootstrap/js/dist/toast';
import useStatusStore from '../stores/statusStore'

const props = defineProps(['msg']);
const toastEl = ref(null);
const statusStore = useStatusStore()

// 3. 使用 onMounted 生命週期鉤子取代 Options API 的 mounted()
onMounted(() => {
  // 透過 .value 存取實際的 DOM 元素
  const bsToast = new Toast(toastEl.value, {
    // 顯示時間設定
    delay: 5000,
  });

  // 吐司顯示
  bsToast.show();

  // 核心修改：監聽 Bootstrap 關閉事件
  toastEl.value.addEventListener('hidden.bs.toast', () => {
    // 當動畫結束、吐司完全隱藏後，呼叫 Store 的 removeMessage 方法，傳入當前訊息的 ID
    statusStore.removeMessage(props.msg.id);
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

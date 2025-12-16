<!-- DeleteProductModal.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Modal from 'bootstrap/js/dist/modal';
import useCouponStore from '../stores/couponStore'

const couponStore = useCouponStore()

const modal = ref(null);
const bsModal = ref(null);
const tempProduct = ref({}); // 用於儲存即將刪除的產品資訊

onMounted(() => {
  if (modal.value) {
    bsModal.value = new Modal(modal.value);
    // 監聽 Bootstrap 的 hide.bs.modal 事件
    modal.value.addEventListener('hide.bs.modal', handleModalHide);
  }
});

onUnmounted(() => {
  if (modal.value && bsModal.value) { // 確保移除監聽器
    modal.value.removeEventListener('hide.bs.modal', handleModalHide);
    bsModal.value.dispose();
  }
});

// 新增此函式：在 Modal 隱藏前，讓當前焦點元素失去焦點
const handleModalHide = () => {
  document.activeElement.blur();
};

// 開啟 Modal，並接收要刪除的產品資料
const openModal = (item) => {
  tempProduct.value = { ...item };
  bsModal.value.show();
};

// 執行刪除動作
const confirmDelete = async () => {
  const success = await couponStore.removeCoupon(tempProduct.value);

  if (success) {
    bsModal.value.hide();
  }
};

defineExpose({
  openModal,
});
</script>

<template>
  <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true"
    ref="modal">
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title" id="deleteModalLabel">刪除優惠劵</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          是否刪除
          <strong class="text-danger">「{{ tempProduct.title }}」</strong>
          優惠劵？(刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-danger" @click="confirmDelete">確認刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>

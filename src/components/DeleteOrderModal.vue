<template>
  <div class="modal fade" tabindex="-1" ref="modalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            確認刪除
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <p>
            是否確定要刪除{{ tempOrderId }}號訂單？<br>
            <strong>刪除後將無法復原。</strong>
          </p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>
          <!-- 綁定點擊事件，觸發刪除邏輯 -->
          <button type="button" class="btn btn-danger" @click="confirmDelete">確認刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Modal from 'bootstrap/js/dist/modal';
import useOrderStore from '../stores/orderStore';

const orderStore = useOrderStore();

const modalRef = ref(null);
const bsModalInstance = ref(null);
const tempOrderId = ref('');

const handleModalHide = () => {
  if (document.activeElement) {
    document.activeElement.blur();
  }
};

onMounted(() => {
  if (modalRef.value) {
    bsModalInstance.value = new Modal(modalRef.value);
    modalRef.value.addEventListener('hide.bs.modal', handleModalHide);
  }
});

onUnmounted(() => {
  if (modalRef.value && bsModalInstance.value) {
    modalRef.value.removeEventListener('hide.bs.modal', handleModalHide);
    bsModalInstance.value.dispose();
  }
});

// 開啟 Modal 時，傳入要刪除的訂單 ID
const openModal = (id) => {
  tempOrderId.value = id;
  bsModalInstance.value.show();
};

const closeModal = () => {
  bsModalInstance.value.hide();
};

// 執行刪除動作
const confirmDelete = async () => {
  const success = await orderStore.deleteOrder(tempOrderId.value);
  if (success) {
    closeModal();
  }
};

// 暴露方法給父元件使用
defineExpose({
  openModal,
  closeModal,
});
</script>

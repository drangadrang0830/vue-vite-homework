<!-- components/AdminDeleteModal.vue -->
<script setup>
import { ref, onMounted, onUnmounted, shallowRef } from 'vue';
import Modal from 'bootstrap/js/dist/modal';

const modalElement = ref(null);
const bsModal = shallowRef(null);
const tempItem = ref({});
const isLoading = ref(false);
let onConfirmCallback = null;

onMounted(() => {
  if (modalElement.value) {
    bsModal.value = new Modal(modalElement.value);
    modalElement.value.addEventListener('hide.bs.modal', () => document.activeElement.blur());
  }
});

onUnmounted(() => {
  if (bsModal.value) bsModal.value.dispose();
});

const openModal = (item, confirmFn) => {
  tempItem.value = { ...item };
  onConfirmCallback = confirmFn;
  bsModal.value.show();
};

const handleConfirm = async () => {
  if (onConfirmCallback) {
    isLoading.value = true;
    await onConfirmCallback(tempItem.value);
    isLoading.value = false;
    bsModal.value.hide();
  }
};

defineExpose({ openModal });
</script>

<template>
  <div class="modal fade" ref="modalElement" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title">確認刪除</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          是否確定刪除 <strong class="text-danger">「{{ tempItem.title || '此項目' }}」</strong>？
          <p class="text-muted small mt-2 mb-0">(刪除後將無法恢復)</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal"
            :disabled="isLoading">取消</button>
          <button type="button" class="btn btn-danger" @click="handleConfirm" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-1"></span>
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

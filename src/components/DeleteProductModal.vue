<!-- DeleteProductModal.vue -->
<script setup>
import { ref, onMounted, onUnmounted, shallowRef } from 'vue';
import Modal from 'bootstrap/js/dist/modal';
import useAdminProductsStore from '../stores/AdminProductsStore'

const AdminProductsStore = useAdminProductsStore();

const modal = ref(null);
const bsModal = shallowRef(null)
const tempProduct = ref({});

//MODAL控制
onMounted(() => {
  if (modal.value) {
    bsModal.value = new Modal(modal.value);
    modal.value.addEventListener('hide.bs.modal', handleModalHide);
  }
});

onUnmounted(() => {
  if (modal.value && bsModal.value) {
    modal.value.removeEventListener('hide.bs.modal', handleModalHide);
    bsModal.value.dispose();
  }
});

//開啟時接收
const openModal = (item) => {
  tempProduct.value = { ...item };
  bsModal.value.show();
};

//關閉前隱藏
const handleModalHide = () => {
  document.activeElement.blur();
};

// 刪除產品
const confirmDelete = async () => {
  const success = await AdminProductsStore.deleteProduct(tempProduct.value);
  if (success) {
    bsModal.value.hide();
  }
};

// 暴露
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
          <h5 class="modal-title" id="deleteModalLabel">刪除產品</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          是否刪除
          <strong class="text-danger">「{{ tempProduct.title }}」</strong>
          商品？(刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-danger" @click="confirmDelete">確認刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>

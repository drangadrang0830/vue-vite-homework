<!-- DeleteProductModal.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Modal from 'bootstrap/js/dist/modal';
import useProductsStore from '../stores/productsStore';

const productsStore = useProductsStore();

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
  // 呼叫 Pinia Store 中的 deleteProduct 函式
  const success = await productsStore.deleteProduct(tempProduct.value);

  if (success) {
    // 刪除成功後關閉 Modal
    bsModal.value.hide();
    // 註：因為 deleteProduct 內部已經呼叫了 getProducts()，所以這裡不需要 emit 事件
  }
};

// 將 openModal 函式暴露給父元件 ProductsView.vue 使用
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

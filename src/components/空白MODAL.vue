<!-- GenericModal.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Modal from 'bootstrap/js/dist/modal';

// 1. 宣告響應式參考 (Refs)
const modalRef = ref(null);      // 用於綁定 template 中的主要 modal div
const bsModalInstance = ref(null); // 用於儲存 Bootstrap Modal 實例

// (選用) 處理 Modal 隱藏時的額外邏輯，例如讓焦點離開按鈕
const handleModalHide = () => {
  if (document.activeElement) {
    document.activeElement.blur();
  }
};

// 2. 在 onMounted 中實體化 Modal
onMounted(() => {
  if (modalRef.value) {
    bsModalInstance.value = new Modal(modalRef.value);
    // 監聽 Bootstrap 的隱藏事件
    modalRef.value.addEventListener('hide.bs.modal', handleModalHide);
  }
});

// 3. 在 onUnmounted 中清理資源
onUnmounted(() => {
  if (modalRef.value && bsModalInstance.value) {
    // 移除事件監聽器
    modalRef.value.removeEventListener('hide.bs.modal', handleModalHide);
    // 銷毀 Bootstrap 實例以釋放記憶體
    bsModalInstance.value.dispose();
  }
});

// 4. 定義開啟/關閉 Modal 的公開方法
const openModal = (/* 這裡可以接收父元件傳入的資料 */) => {
  // 在此處處理接收到的資料 (例如 tempProduct.value = data)
  bsModalInstance.value.show();
};

const closeModal = () => {
  bsModalInstance.value.hide();
};

// 5. 使用 defineExpose 暴露方法給父元件使用
defineExpose({
  openModal,
  closeModal,
});
</script>

<template>
  <!-- 6. Modal 的標準 HTML 結構，並綁定 ref="modalRef" -->
  <div class="modal fade" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabel">空白 Modal 標題</h5>
          <!-- 使用 data-bs-dismiss 讓關閉按鈕能自動觸發 Bootstrap 關閉流程 -->
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <!-- 這裡放置您 Modal 的主要內容 -->
          <p>這是空白 Modal 的內容區域。</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消/關閉</button>
          <!-- 確認按鈕可以綁定您自定義的確認函式，例如 @click="confirmAction" -->
          <button type="button" class="btn btn-primary">確認動作</button>
        </div>
      </div>
    </div>
  </div>
</template>

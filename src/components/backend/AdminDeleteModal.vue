<script setup>
import { ref } from 'vue'
import { useModal } from '@/composables/useModal'

const { modalElement, openModal, closeModal } = useModal()

const tempItem = ref({})
const isLoading = ref(false)
let onConfirmCallback = null

//開啟帶入
const show = (item, confirmFn) => {
  tempItem.value = { ...item }
  onConfirmCallback = confirmFn
  openModal()
}

//刪除按鈕事件
const handleConfirm = async () => {
  if (typeof onConfirmCallback === 'function') {
    isLoading.value = true
    try {
      await onConfirmCallback(tempItem.value)
      closeModal()
    } finally {
      isLoading.value = false
    }
  }
}

defineExpose({
  openModal: show
})
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

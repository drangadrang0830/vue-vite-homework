import { ref, onMounted, onUnmounted, shallowRef } from 'vue'
import Modal from 'bootstrap/js/dist/modal'

export function useModal() {
  //實體化
  const modalElement = ref(null)
  const bsModal = shallowRef(null)

  //初始化
  onMounted(() => {
    if (modalElement.value) {
      bsModal.value = new Modal(modalElement.value)

      modalElement.value.addEventListener('hide.bs.modal', () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      })
    }
  })

  //卸載處理
  onUnmounted(() => {
    if (bsModal.value) {
      bsModal.value.dispose()
    }
  })

  //開關控制
  const openModal = () => bsModal.value?.show()
  const closeModal = () => bsModal.value?.hide()

  return {
    modalElement,
    bsModal,
    openModal,
    closeModal
  }
}

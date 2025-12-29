import { ref, onMounted, onUnmounted, shallowRef } from 'vue'
import Modal from 'bootstrap/js/dist/modal'

export function useModal() {
  const modalElement = ref(null)
  const bsModal = shallowRef(null)

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

  onUnmounted(() => {
    if (bsModal.value) {
      bsModal.value.dispose()
    }
  })

  const openModal = () => bsModal.value?.show()
  const closeModal = () => bsModal.value?.hide()

  return {
    modalElement,
    bsModal,
    openModal,
    closeModal
  }
}

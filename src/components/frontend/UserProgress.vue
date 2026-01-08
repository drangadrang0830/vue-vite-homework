<script setup>
import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue'
import useStatusStore from '@/stores/statusStore'

const statusStore = useStatusStore()
let timer = null

const props = defineProps({
  step: {
    type: Number,
    required: true
  }
})

//各進度設定
const steps = [
  { title: '確認購物', icon: 'bi-cart-check' },
  { title: '填寫資料', icon: 'bi-pencil-square' },
  { title: '確認訂單', icon: 'bi-card-list' },
  { title: '完成下訂', icon: 'bi-check-circle' }
]

const denominator = steps.length - 1
const initialPercent = (statusStore.previousStep / denominator) * 100
const displayWidth = ref(`${initialPercent}%`)

const animateToStep = (targetStep) => {
  const endWidth = (targetStep / denominator) * 100
  displayWidth.value = `${endWidth}%`
  statusStore.setPreviousStep(targetStep)
}

//監視步驟調整進度條
watch(() => props.step, (newStep) => {
  animateToStep(newStep)
})

//創建時
onMounted(() => {
  nextTick(() => {
    timer = setTimeout(() => {
      animateToStep(props.step)
    }, 50)
  })
})

// 組件卸載時清除計時器
onUnmounted(() => {
  if (timer) clearTimeout(timer)
})

const currentStep = computed(() => props.step)
</script>

<style scoped>
.invert {
  filter: invert(100%);
}

/* 增加組件間距控制 */
.user-progress {
  margin-bottom: 2rem;
}
</style>

<template>
  <div class="user-progress">
    <div class="container my-4 pt-3">
      <div class="px-5 pt-2 pb-5">
        <div class="position-relative">
          <div class="progress" style="height: 10px;">
            <div class="progress-bar bg-primary" :style="{
              width: displayWidth,
              transition: 'width 1s cubic-bezier(0.8, 0, 1, 1)'
            }"></div>
          </div>
          <div class="position-absolute top-50 start-0 end-0 translate-middle-y d-flex justify-content-between">
            <div v-for="(step, index) in steps" :key="index" class="position-relative">
              <div
                class="rounded-circle d-flex align-items-center justify-content-center border border-4 shadow-sm position-absolute start-50 translate-middle"
                :class="currentStep >= index ? 'border-primary' : 'border-secondary-subtle text-muted'" :style="{
                  width: '40px',
                  height: '40px',
                  top: '0px',
                  zIndex: '10',
                  transition: 'border-color 1s cubic-bezier(0.8, 0, 1, 1), color 2.5s'
                }">
                <div
                  class="bg-body text-body rounded-circle d-flex align-items-center justify-content-center w-100 h-100 invert position-absolute"
                  :style="{
                    opacity: currentStep >= index ? 1 : 0,
                    transition: 'opacity 1s cubic-bezier(0.8, 0, 1, 1)'
                  }">
                  <i :class="['bi', step.icon]"></i>
                </div>
                <i v-if="currentStep < index" :class="['bi', step.icon]"></i>
              </div>
              <div class="position-absolute start-50 translate-middle-x mt-4 small fw-bold text-nowrap"
                :class="currentStep >= index ? 'text-body' : 'text-muted'" style="top: 10px;">
                {{ step.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

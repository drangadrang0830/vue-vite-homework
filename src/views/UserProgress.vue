<template>
  <div>
    <div class="container my-4 pt-5">
      <div class="px-5 pt-2 pb-5">
        <div class="position-relative">
          <div class="progress" style="height: 10px;">
            <div class="progress-bar bg-primary" :style="{
              width: progressWidth,
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
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import useStatusStore from '@/stores/statusStore'

const route = useRoute()
const statusStore = useStatusStore()

const steps = [
  { title: '選擇商品', icon: 'bi-bag' },
  { title: '確認購物', icon: 'bi-cart-check' },
  { title: '填寫資料', icon: 'bi-pencil-square' },
  { title: '確認訂單', icon: 'bi-card-list' },
  { title: '完成下訂', icon: 'bi-check-circle' }
]

const currentStep = computed(() => {
  if (statusStore.isOrderCompleted) return 4
  const path = route.path
  if (path.includes('/checkout')) return 3
  if (path.includes('/order')) return 2
  if (path.includes('/cart')) return 1
  return 0
})

const progressWidth = computed(() => {
  return `${(currentStep.value / (steps.length - 1)) * 100}%`
})
</script>

<style scoped>
.invert {
  filter: invert(100%);
}
</style>

<!-- 結帳完成頁面加註
<script setup>
import useApiStore from '@/stores/statusStore'

const statusStore = useApiStore()

const submitOrder = async () => {
  // ... axios 串接邏輯 ...
  const res = await axios.post(api, orderForm)
  if (res.data.success) {
    // 成功後更新 Pinia，進度條會自動跳到 Step 3
    statusStore.setOrderCompleted(true)
  }
}
</script> -->

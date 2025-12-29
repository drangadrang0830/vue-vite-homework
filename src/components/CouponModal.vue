<script setup>
import { ref } from 'vue'
import { useModal } from '@/composables/useModal'
import useAdminCouponStore from '@/stores/adminCouponStore'

const adminCouponStore = useAdminCouponStore()

const tempCoupon = ref({})
const isNew = ref(false)

const { modalElement, openModal, closeModal } = useModal()

//開啟時資料預處理
const show = (item, isNewMode) => {
  isNew.value = isNewMode
  if (isNewMode) {
    tempCoupon.value = { title: '', is_enabled: 0, percent: '', due_date: '', code: '' }
  } else {
    tempCoupon.value = { ...item }
    tempCoupon.value.due_date = new Date(item.due_date * 1000).toISOString().split('T')[0]
  }
  openModal()
}

// 提交表單
const submitCoupon = async () => {
  const apiData = { ...tempCoupon.value }
  const date = new Date(apiData.due_date)
  apiData.due_date = Math.floor(date.getTime() / 1000)
  let success = false
  if (isNew.value) {
    success = await adminCouponStore.addCoupon(apiData)
  } else {
    success = await adminCouponStore.updateCoupon(apiData)
  }
  if (success) closeModal()
}

defineExpose({
  openModal: show,
})
</script>

<template>
  <div class="modal fade" tabindex="-1" aria-labelledby="couponModalLabel" aria-hidden="true" ref="modalElement">
    <div class="modal-dialog modal-lg">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="couponModalLabel">
            <span>{{ isNew ? '新增優惠券' : '編輯優惠券' }}</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-12">
              <div class="mb-3">
                <label for="title" class="form-label">標題<span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="title" v-model.trim="tempCoupon.title" placeholder="請輸入標題">
              </div>
              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="percent" class="form-label">折扣百分比<span class="text-danger">*</span></label>
                  <input type="number" class="form-control" id="percent" v-model.number="tempCoupon.percent"
                    placeholder="請輸入折扣百分比 (例如：80 代表八折)">
                </div>
                <div class="mb-3 col-md-6">
                  <label for="due_date" class="form-label">到期日<span class="text-danger">*</span></label>
                  <input type="date" class="form-control" id="due_date" v-model="tempCoupon.due_date">
                </div>
              </div>
              <div class="mb-3">
                <label for="code" class="form-label">優惠碼<span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="code" v-model.trim="tempCoupon.code" placeholder="請輸入優惠碼">
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" :true-value="1" :false-value="0" id="is_enabled"
                    v-model="tempCoupon.is_enabled">
                  <label class="form-check-label" for="is_enabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="submitCoupon">
            確認{{ isNew ? '新增' : '更新' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

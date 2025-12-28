<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Modal from 'bootstrap/js/dist/modal';
import useAdminCouponStore from '../stores/adminCouponStore';

const adminCouponStore = useAdminCouponStore();

const modal = ref(null);
const bsModal = ref(null);
const tempCoupon = ref({}); // 用於綁定表單資料
const isNew = ref(false); // 判斷是新增還是編輯模式

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

const handleModalHide = () => {
  document.activeElement.blur();
  tempCoupon.value = {}; // 關閉時清空資料
};

// 開啟 Modal，接收要編輯的資料 (item) 和模式 (isNewMode)
const openModal = (item, isNewMode) => {
  isNew.value = isNewMode;
  if (isNewMode) {
    // 新增模式：初始化預設值
    tempCoupon.value = {
      title: '',
      is_enabled: 0,
      percent: '',
      due_date: '', // 日期輸入框需要 YYYY-MM-DD 格式
      code: '',
    };
  } else {
    // 編輯模式：複製現有資料
    tempCoupon.value = { ...item };
    // 將時間戳轉換為 YYYY-MM-DD 格式以適應 input type="date"
    tempCoupon.value.due_date = new Date(item.due_date * 1000).toISOString().split('T')[0];
  }
  bsModal.value.show();
};

// 提交表單：呼叫 Store 中的新增或編輯函式
const submitCoupon = async () => {
  // 將 input type="date" 的 YYYY-MM-DD 格式轉換回 API 需要的時間戳 (timestamp)
  const date = new Date(tempCoupon.value.due_date);
  // getTime() 得到毫秒，除以 1000 變成秒數
  tempCoupon.value.due_date = Math.floor(date.getTime() / 1000);

  let success = false;
  try {
    if (isNew.value) {
      success = await adminCouponStore.addCoupon(tempCoupon.value);
    } else {
      success = await adminCouponStore.updateCoupon(tempCoupon.value);
    }

    if (success) {
      bsModal.value.hide();
    }
  } catch (error) {
    console.error("提交優惠券時發生錯誤:", error);
  }
};

defineExpose({
  openModal,
});
</script>

<template>
  <div class="modal fade" tabindex="-1" aria-labelledby="couponModalLabel" aria-hidden="true" ref="modal">
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
                <input type="text" class="form-control" id="title" v-model="tempCoupon.title" placeholder="請輸入標題">
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
                <input type="text" class="form-control" id="code" v-model="tempCoupon.code" placeholder="請輸入優惠碼">
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

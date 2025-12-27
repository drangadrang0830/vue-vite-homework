<script setup>
import { ref, onMounted } from 'vue'
import useCouponStore from '../stores/couponStore'
import CouponModal from '../components/CouponModal.vue'
import SharedPagination from '../components/SharedPagination.vue'
import AdminDeleteModal from '../components/AdminDeleteModal.vue'

const couponStore = useCouponStore()

const couponModal = ref(null);
const deleteModal = ref(null);

// 創建時讀取產品資訊
onMounted(() => {
  couponStore.getCoupon();
})

//新增按鈕
const openNewCouponModal = () => {
  couponModal.value.openModal(null, true);
}

//編輯按鈕
const openEditCouponModal = (item) => {
  couponModal.value.openModal(item, false);
}

const openDeleteCoupon = (coupon) => {
  deleteModal.value.openModal(coupon, async (target) => {
    const success = await couponStore.removeCoupon(target);
    if (success) couponStore.getCoupon();
  });
};

const handlePageChange = (page) => {
  couponStore.getCoupon(page);
};

</script>

<template>
  <div>
    <div class="text-end m-3">
      <button class="btn btn-primary" type="button" @click="openNewCouponModal()">新增優惠劵</button>
    </div>
    <div class="container-fluid d-lg-none p-0 my-4">
      <div class="row g-3" v-if="couponStore.couponData.coupons?.length > 0">
        <div class="col-6" v-for="coupon in couponStore.couponData.coupons" :key="coupon.id">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-body p-3 d-flex flex-column">
              <div class="mb-2">
                <h6 class="card-title fw-bold mb-1 text-truncate" :title="coupon.title">
                  {{ coupon.title }}
                </h6>
                <div class="small">
                  <span class="badge rounded-pill"
                    :class="coupon.is_enabled ? 'bg-success-subtle text-success' : 'bg-light text-muted border'">
                    {{ coupon.is_enabled ? '已啟用' : '未啟用' }}
                  </span>
                </div>
              </div>

              <!-- 折扣資訊 -->
              <div class="mb-2">
                <div class="small text-muted">折扣強度</div>
                <div class="h5 mb-0 fw-bold text-primary">{{ coupon.percent }}<span class="small">%</span></div>
              </div>

              <!-- 到期日期 -->
              <div class="mb-3 mt-auto">
                <div class="small text-muted">到期日</div>
                <div class="small">{{ $filters.date(coupon.due_date) }}</div>
              </div>

              <!-- 操作按鈕 -->
              <div class="d-grid gap-2">
                <button class="btn btn-sm btn-outline-primary" @click="openEditCouponModal(coupon)">
                  <i class="bi bi-pencil"></i> 編輯
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="openDeleteCoupon(coupon)">
                  <i class="bi bi-trash"></i> 刪除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 無資料顯示 -->
      <div v-else class="text-center py-5 text-muted bg-light rounded">
        目前尚無優惠券資料
      </div>
    </div>

    <!-- 原本的 table 建議加上 d-none d-lg-table -->
    <table class="table mt-4 table-hover d-none d-lg-table">
      <thead>
        <tr class="text-center">
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr class="text-center" v-for="coupon in couponStore.couponData.coupons" :key="coupon.id">
          <td>{{ coupon.title }}</td>
          <td>{{ coupon.percent }}</td>
          <td>{{ $filters.date(coupon.due_date) }}</td>
          <td>
            <span class="text-success" v-if="coupon.is_enabled">已啟用</span>
            <span class="text-muted" v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" @click="openEditCouponModal(coupon)">編輯</button>
              <button class="btn btn-outline-danger btn-sm" @click="openDeleteCoupon(coupon)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <SharedPagination v-if="couponStore.couponData.pagination > 1" :pages="couponStore.couponData.pagination"
      @emit-pages="handlePageChange"></SharedPagination>
    <AdminDeleteModal ref="deleteModal" />
    <CouponModal ref="couponModal"></CouponModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import useStatusStore from '../stores/statusStore'
import useCouponStore from '../stores/couponStore'
import CouponModal from '../components/CouponModal.vue'
import SharedPagination from '../components/SharedPagination.vue'
import AdminDeleteModal from '../components/AdminDeleteModal.vue'

const statusStore = useStatusStore()
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
    <LoadingOverlay :active="statusStore.isLoading"></LoadingOverlay>
    <div class="text-end m-3">
      <button class="btn btn-primary" type="button" @click="openNewCouponModal()">新增優惠劵</button>
    </div>
    <table class="table mt-4 table-hover">
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
        <tr class="text-center" v-for="item in couponStore.couponData.coupons" :key="item.id">
          <td>{{ item.title }}</td>
          <td>{{ item.percent }}</td>
          <td>{{ $filters.date(item.due_date) }}</td>
          <td>
            <span class="text-success" v-if="item.is_enabled">已啟用</span>
            <span class="text-muted" v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" @click="openEditCouponModal(item)">編輯</button>
              <button class="btn btn-outline-danger btn-sm" @click="openDeleteCoupon(item)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <SharedPagination v-if="couponStore.couponData.pagination" :pages="couponStore.couponData.pagination"
      @emit-pages="handlePageChange"></SharedPagination>
    <AdminDeleteModal ref="deleteModal" />
    <CouponModal ref="couponModal"></CouponModal>
  </div>
</template>

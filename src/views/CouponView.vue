<script setup>
import { ref, onMounted } from 'vue'
import useStatusStore from '../stores/statusStore'
import useCouponStore from '../stores/couponStore'
import DeleteCouponModal from '../components/DeleteCouponModal.vue'
import CouponModal from '../components/CouponModal.vue'
import SharedPagination from '../components/SharedPagination.vue'

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

//刪除按鈕：開啟刪除確認 Modal
const openDeleteCouponModal = (item) => {
  deleteModal.value.openModal(item);
}

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
              <button class="btn btn-outline-danger btn-sm" @click="openDeleteCouponModal(item)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <SharedPagination v-if="couponStore.couponData.pagination" :pages="couponStore.couponData.pagination"
      @emit-pages="handlePageChange"></SharedPagination>
    <DeleteCouponModal ref="deleteModal"></DeleteCouponModal>
    <CouponModal ref="couponModal"></CouponModal>
  </div>
</template>

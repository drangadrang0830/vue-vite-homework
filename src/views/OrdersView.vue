<script setup>
import { onMounted, ref } from 'vue'
import OrderModal from '../components/OrderModal.vue'
import DeleteOrderModal from '../components/DeleteOrderModal.vue';
import useStatusStore from '../stores/statusStore'
import useOrderStore from '../stores/orderStore'
import useUserOrder from '../stores/userOrder'
import SharedPagination from '../components/SharedPagination.vue'

// const modal = ref(null);
const statusStore = useStatusStore()
const orderStore = useOrderStore()
const userOrder = useUserOrder()

// 綁定 Modal 實例，用於呼叫 openModal 方法
const orderModalRef = ref(null);
const deleteModalRef = ref(null);

// 打開訂單詳情 Modal 的方法
const openOrderDetailModal = (orderItem) => {
  // 將選中的訂單資料傳遞給 Modal 元件的 openModal 方法
  orderModalRef.value.openModal(orderItem);
}

const openDeleteModal = (orderId) => {
  deleteModalRef.value.openModal(orderId);
}

// 創建時讀取產品資訊
onMounted(() => {
  orderStore.getOrders();
})

//轉已付費
const changeCheckbox = async (orderId) => {
  const isPay = await userOrder.payOrder(orderId)
  if (isPay) {
    await orderStore.getOrders()
  }
}

const handlePageChange = (page) => {
  orderStore.getOrders(page);
};

</script>

<template>
  <div>
    <LoadingOverlay :active="statusStore.isLoading"></LoadingOverlay>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">購買時間</th>
          <th>Email</th>
          <th>購買款項</th>
          <th width="100" class="text-center">應付金額</th>
          <th width="200" class="text-center">是否付款</th>
          <th width="200" class="text-center">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in orderStore.orders" :key="item.id">
          <td>{{ $filters.date(item.create_at) }}</td>
          <td>{{ item.user.email }}</td>
          <td>
            <p v-for="product in item.products" :key="product.id">{{ product.product.title }} 數量： {{ product.qty }} {{
              product.product.unit }}</p>
          </td>
          <td class="text-end">
            {{ $filters.currency(item.total) }}
          </td>
          <td class="text-center ">
            <div class="form-check form-switch d-flex align-items-center justify-content-center">
              <!-- 封存 變更事件-付費函式  -->
              <input class="form-check-input" type="checkbox" :id="`paymentStatusSwitch-${item.id}`"
                :checked="item.is_paid" @change="changeCheckbox(item.id)">

              <label class="form-check-label ms-2" :for="`paymentStatusSwitch-${item.id}`"> <!-- 動態綁定 for -->
                <span v-if="!item.is_paid">尚未付款</span>
                <span v-else class="text-success">付款完成</span>
              </label>
            </div>
          </td>
          <td class="text-center">
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" @click="openOrderDetailModal(item)">檢視</button>
              <button class="btn btn-outline-danger btn-sm" @click="openDeleteModal(item.id)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <SharedPagination v-if="orderStore.pagination.total_pages > 1" :pages="orderStore.pagination"
      @emit-pages="handlePageChange">
    </SharedPagination>
    <OrderModal ref="orderModalRef"></OrderModal>
    <DeleteOrderModal ref="deleteModalRef"></DeleteOrderModal>
  </div>
</template>

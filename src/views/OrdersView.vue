<script setup>
import { onMounted, ref } from 'vue'
import OrderModal from '../components/OrderModal.vue'
import useStatusStore from '../stores/statusStore'
import useOrderStore from '../stores/orderStore'
import useUserOrder from '../stores/userOrderStore'
import SharedPagination from '../components/SharedPagination.vue'
import AdminDeleteModal from '../components/AdminDeleteModal.vue'

// const modal = ref(null);
const statusStore = useStatusStore()
const orderStore = useOrderStore()
const userOrder = useUserOrder()

const orderModalRef = ref(null);
const deleteModal = ref(null);

// 打開訂單詳情 Modal 的方法
const openOrderDetailModal = (orderItem) => {
  // 將選中的訂單資料傳遞給 Modal 元件的 openModal 方法
  orderModalRef.value.openModal(orderItem);
}

// OrdersView.vue 內的建議寫法
const openDeleteOrder = (order) => {
  // 手動幫它加一個 title 屬性供 Modal 顯示
  const displayItem = {
    ...order,
    title: `訂單編號: ${order.id.substring(0, 8)} (${order.user.email})`
  };

  deleteModal.value.openModal(displayItem, async (target) => {
    const success = await orderStore.deleteOrder(target.id);
    if (success) {
      orderStore.getOrders();
    }
  });
};

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
              <button class="btn btn-outline-danger btn-sm" @click="openDeleteOrder(item)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <SharedPagination v-if="orderStore.pagination.total_pages > 1" :pages="orderStore.pagination"
      @emit-pages="handlePageChange">
    </SharedPagination>
    <OrderModal ref="orderModalRef"></OrderModal>
    <AdminDeleteModal ref="deleteModal" />
  </div>
</template>

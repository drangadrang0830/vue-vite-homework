<script setup>
import { onMounted } from 'vue'
// import ProductModal from '../components/ProductModal.vue'
import useStatusStore from '../stores/statusStore'
import useOrderStore from '../stores/orderStore'

// const modal = ref(null);
const statusStore = useStatusStore()
const orderStore = useOrderStore()

// 創建時讀取產品資訊
onMounted(() => {
  orderStore.getOrders();
})

//新增按鈕
// const openNewProductModal = () => {
//   modal.value.openModal();
// }

//編輯按鈕
// const openEditProductModal = (item) => {
//   modal.value.openModal(item);
// }

//按鈕後續處理
// const handleUpdateComplete = () => {
//   console.log("收到子元件通知，正在重新整理產品列表...");
//   productsStore.getProducts();
// }

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
          <th width="200">是否付款</th>
          <th width="200">編輯</th>
        </tr>
      </thead>
      <tbody>
        <!-- 封存v-for="item in productsStore.products" :key="item.id" -->
        <tr>
          <td>2021/4/8</td>
          <td>1234@567.890</td>
          <td>
            A:1片 <br>
            B:1片 <br>
            C:2片 <br>
          </td>
          <!-- 封存{{ $filters.currency(item.price) }} -->
          <td class="text-end">
            1,234
          </td>
          <td>
            <div class="form-check form-switch d-flex align-items-center">
              <input class="form-check-input" type="checkbox" id="paymentStatusSwitch">
              <label class="form-check-label ms-2" for="paymentStatusSwitch">
                已付款
              </label>
            </div>
          </td>
          <td>
            <div class="btn-group">
              <!-- 封存 @click="openEditProductModal(item)"-->
              <button class="btn btn-outline-primary btn-sm">編輯</button>
              <button class="btn btn-outline-danger btn-sm">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <ProductPagination></ProductPagination>
    <ProductModal ref="modal" @update-complete="handleUpdateComplete"></ProductModal> -->
  </div>
</template>

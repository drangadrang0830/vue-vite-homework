<script setup>
import { ref, onMounted } from 'vue'
import ProductModal from '../components/ProductModal.vue'

const modal = ref(null);

// 創建時讀取產品資訊
// onMounted(() => {
//   productsStore.getProducts();
// })

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
          <th width="60" class="text-center">購買款項</th>
          <th width="60" class="text-center">應付金額</th>
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
          <td class="text-end">
            switch確認紐 已付款
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" @click="openEditProductModal(item)">編輯</button>
              <button class="btn btn-outline-danger btn-sm">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <ProductPagination></ProductPagination>
    <ProductModal ref="modal" @update-complete="handleUpdateComplete"></ProductModal>
  </div>
</template>

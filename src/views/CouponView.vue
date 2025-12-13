<script setup>
// import { ref, onMounted } from 'vue'
import useStatusStore from '../stores/statusStore'

// import ProductModal from '../components/ProductModal.vue'
// import ProductPagination from '../components/ProductPagination.vue'

const statusStore = useStatusStore()


// const modal = ref(null);

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
    <div class="text-end m-3">
      <!-- 封存@click="openNewProductModal()" -->
      <button class="btn btn-primary" type="button">新增優惠劵</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <!-- 封存 v-for="item in productsStore.products" :key="item.id"-->
        <tr>
          <td>good</td>
          <td>50%</td>
          <td>2021/8/31</td>
          <td class="text-center">
            <!-- 封存 v-if="item.is_enabled" -->
            <span class="text-success">已啟用</span>
            <!-- 封存  v-else-->
            <!-- <span class="text-muted">未啟用</span> -->
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
    <!-- <ProductPagination></ProductPagination> -->
    <!-- <ProductModal ref="modal" @update-complete="handleUpdateComplete"></ProductModal> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import useStatusStore from '../stores/statusStore'
import useProductsStore from '../stores/productsStore'
import ProductModal from '../components/ProductModal.vue'
import DeleteProductModal from '../components/DeleteProductModal.vue'
import ProductPagination from '../components/ProductPagination.vue'

const statusStore = useStatusStore()
const productsStore = useProductsStore()

const productModal = ref(null);
const deleteModal = ref(null);

// 創建時讀取產品資訊
onMounted(() => {
  productsStore.getProducts();
})

//新增按鈕：開啟新增 Modal
const openNewProductModal = () => {
  productModal.value.openModal();
}

//編輯按鈕：開啟編輯 Modal
const openEditProductModal = (item) => {
  productModal.value.openModal(item);
}

//刪除按鈕：開啟刪除確認 Modal
const openDeleteProductModal = (item) => {
  deleteModal.value.openModal(item);
}

//按鈕後續處理(emit事件處理函式)
const handleUpdateComplete = () => {
  productsStore.getProducts();
}

</script>

<template>
  <div>
    <LoadingOverlay :active="statusStore.isLoading"></LoadingOverlay>
    <div class="text-end m-3">
      <button class="btn btn-primary" type="button" @click="openNewProductModal()">新增商品</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="60" class="text-center">原價</th>
          <th width="60" class="text-center">售價</th>
          <th width="100" class="text-center">是否啟用</th>
          <th width="200">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in productsStore.products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-end">
            {{ $filters.currency(item.origin_price) }}
          </td>
          <td class="text-end">
            {{ $filters.currency(item.price) }}
          </td>
          <td class="text-center">
            <span class="text-success" v-if="item.is_enabled">已啟用</span>
            <span class="text-muted" v-else>未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" @click="openEditProductModal(item)">編輯</button>
              <button class="btn btn-outline-danger btn-sm" @click="openDeleteProductModal(item)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <ProductPagination></ProductPagination>
    <ProductModal ref="productModal" @update-complete="handleUpdateComplete"></ProductModal>
    <DeleteProductModal ref="deleteModal"></DeleteProductModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import useStatusStore from '../stores/statusStore'
import useProductsStore from '../stores/AdminProductsStore'
import ProductModal from '../components/ProductModal.vue'
import DeleteProductModal from '../components/DeleteProductModal.vue'
import SharedPagination from '../components/SharedPagination.vue'

const statusStore = useStatusStore()
const productsStore = useProductsStore()

const productModal = ref(null);
const deleteModal = ref(null);

onMounted(() => {
  productsStore.getProducts();
})

//Modal控制
const openNewProductModal = () => {
  productModal.value.openModal();
}

const openEditProductModal = (item) => {
  productModal.value.openModal(item);
}

const openDeleteProductModal = (item) => {
  deleteModal.value.openModal(item);
}

const handleUpdateComplete = () => {
  productsStore.getProducts();
}

const handlePageChange = (page) => {
  productsStore.getProducts(page);
};


</script>

<template>
  <div>
    <LoadingOverlay :active="statusStore.isLoading"></LoadingOverlay>
    <div class="text-end m-3">
      <button class="btn btn-primary" type="button" @click="openNewProductModal()">新增商品</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr class="text-center">
          <th width="15%" class="d-none d-md-table-cell">分類</th>
          <th width="35%">產品名稱</th>
          <th width="5%">原價</th>
          <th width="5%">售價</th>
          <th width="20%"><span class="d-none d-md-inline">是否</span>啟用<span class="d-inline d-md-none">?</span></th>
          <th width="20%">編輯</th>
        </tr>
      </thead>
      <tbody v-if="productsStore.products.length > 0">
        <tr v-for="item in productsStore.products" :key="item.id">
          <td class="text-center d-none d-md-table-cell">{{ item.category }}</td>
          <td class="text-center">{{ item.title }}</td>
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
          <td class="text-center">
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" @click="openEditProductModal(item)">編輯</button>
              <button class="btn btn-outline-danger btn-sm" @click="openDeleteProductModal(item)">刪除</button>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="6" class="text-center py-5 text-muted">目前沒有產品資料</td>
        </tr>
      </tbody>
    </table>
    <SharedPagination v-if="productsStore.pagination.total_pages" :pages="productsStore.pagination"
      @emit-pages="handlePageChange">
    </SharedPagination>
    <ProductModal ref="productModal" @update-complete="handleUpdateComplete"></ProductModal>
    <DeleteProductModal ref="deleteModal"></DeleteProductModal>
  </div>
</template>

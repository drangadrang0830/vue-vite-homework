<script setup>
import { ref, onMounted } from 'vue'
import useAdminProductsStore from '@/stores/adminProductsStore'
import ProductModal from '@/components/ProductModal.vue'
import SharedPagination from '@/components/SharedPagination.vue'
import AdminDeleteModal from '@/components/AdminDeleteModal.vue'

const adminProductsStore = useAdminProductsStore()

const productModal = ref(null)
const deleteModal = ref(null)

onMounted(() => {
  adminProductsStore.getProducts()
})

//Modal控制
const openProductModal = (isNew, item) => {
  if (isNew) {
    productModal.value.openModal()
  } else {
    productModal.value.openModal(item)
  }
}

const openDeleteProduct = (item) => {
  deleteModal.value.openModal(item, async (target) => {
    const success = await adminProductsStore.deleteProduct(target)
    if (success) {
      adminProductsStore.getProducts()
    }
  })
}

//更新按鈕事件
const handleUpdateComplete = () => {
  adminProductsStore.getProducts()
}

//切換分頁事件
const handlePageChange = (page) => {
  adminProductsStore.getProducts(page)
}

</script>

<template>
  <div>
    <div class="text-end m-3">
      <button class="btn btn-primary" type="button" @click="openProductModal()">新增商品</button>
    </div>
    <div class="container-fluid d-lg-none p-0 my-4">
      <div class="row g-2" v-if="adminProductsStore.products.length > 0">
        <div class="col-6" v-for="product in adminProductsStore.products" :key="product.id">
          <div class="card h-100 shadow-sm border-0">
            <div class="card-body p-2 d-flex flex-column">
              <h6 class="card-title text-truncate fw-bold mb-1" :title="product.title">{{ product.title }}</h6>
              <p class="small text-muted mb-1">
                {{ product.category }} | <span :class="product.is_enabled ? 'text-success' : 'text-muted'">{{
                  product.is_enabled ? '已啟用' : '未啟用' }}</span>
              </p>
              <p class="small text-muted mb-1">
                原價{{ $filters.currency(product.origin_price) }} | 售價{{ $filters.currency(product.price) }}
              </p>
              <div class="mt-auto d-grid gap-1">
                <button class="btn btn-sm btn-outline-primary py-1"
                  @click="openProductModal(false, product)">編輯</button>
                <button class="btn btn-sm btn-outline-danger py-1" @click="openDeleteProduct(product)">刪除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <table class="table my-4 d-none d-lg-table table-hover">
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
      <tbody v-if="adminProductsStore.products.length > 0">
        <tr v-for="product in adminProductsStore.products" :key="product.id">
          <td class="text-center d-none d-md-table-cell">{{ product.category }}</td>
          <td class="text-center">{{ product.title }}</td>
          <td class="text-end">
            {{ $filters.currency(product.origin_price) }}
          </td>
          <td class="text-end">
            {{ $filters.currency(product.price) }}
          </td>
          <td class="text-center">
            <span class="text-success" v-if="product.is_enabled">已啟用</span>
            <span class="text-muted" v-else>未啟用</span>
          </td>
          <td class="text-center">
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" @click="openEditProductModal(product)">編輯</button>
              <button class="btn btn-outline-danger btn-sm" @click="openDeleteProduct(product)">刪除</button>
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
    <SharedPagination v-if="adminProductsStore.pagination.total_pages > 1" :pages="adminProductsStore.pagination"
      @emit-pages="handlePageChange" />
    <ProductModal ref="productModal" @update-complete="handleUpdateComplete" />
    <AdminDeleteModal ref="deleteModal" />
  </div>
</template>

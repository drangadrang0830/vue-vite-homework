<script setup>
import { ref, onMounted } from 'vue'
import storeA from '../stores/productsStore'
import ProductModal from '../components/ProductModal.vue'

const productsStore = storeA()

const modal = ref(null);

// 創建時讀取產品資訊
onMounted(() => {
  productsStore.getProducts();
});

//新增按鈕
const openNewProductModal = () => {
  modal.value.openModal();
};

//編輯按鈕
const openEditProductModal = (item) => {
  modal.value.openModal(item);
}

//按鈕後續處理
const handleUpdateComplete = () => {
  console.log("收到子元件通知，正在重新整理產品列表...");
  productsStore.getProducts();
};

</script>

<template>
  <div>
    <div class="text-end m-3">
      <button class="btn btn-primary" type="button" @click="openNewProductModal()">新增商品</button>
    </div>
    <ProductModal ref="modal" @update-complete="handleUpdateComplete"></ProductModal>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120">原價</th>
          <th width="120">售價</th>
          <th width="100">是否啟用</th>
          <th width="200">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in productsStore.products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-right">
            {{ item.origin_price }}
          </td>
          <td class="text-right">
            {{ item.price }}
          </td>
          <td>
            <span class="text-success" v-if="item.is_enabled">已啟用</span>
            <span class="text-muted" v-else>未啟用</span>
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
  </div>
</template>

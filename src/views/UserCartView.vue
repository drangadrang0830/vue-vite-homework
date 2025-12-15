<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useStatusStore from '../stores/statusStore'
import useUserProducts from '../stores/userProducts'
import useUserCartStore from '../stores/userCartStore'
import UserCartPagination from '../components/UserCartPagination.vue'
import UserCart from '../components/UserCart.vue'

const statusStore = useStatusStore()
const userProducts = useUserProducts()
const userCartStore = useUserCartStore()

const router = useRouter()


// 創建時讀取產品資訊
onMounted(() => {
  userProducts.getProducts();
})

const getProduct = (id) => {
  router.push(`/user/product/${id}`)
}

</script>

<template>
  <div>
    <LoadingOverlay :active="statusStore.isLoading"></LoadingOverlay>
    <div class="container">
      <div class="row mt4">
        <div class="col-md-7">
          <table class="table mt-4 align-middle table-hover">
            <thead>
              <tr>
                <th class="text-center">圖片</th>
                <th class="text-center">商品名稱</th>
                <th class="text-center">價格</th>
                <th></th>
              </tr>
            </thead>
            <tbody class="table-group-divider">
              <tr v-for="item in userProducts.products" :key="item.id">
                <td style="width: 150px;">
                  <div style="height: 100px; background-size: cover; background-position: center"
                    :style="{ backgroundImage: `url(${item.imagesUrl[0]})` }"></div>
                </td>
                <td class="text-center"><a href="#" class="text-dark" @click.prevent="getProduct(item.id)">{{ item.title
                    }}</a></td>
                <td class="text-center">
                  <p class="text-decoration-line-through h5" v-if="!item.price">原價{{
                    $filters.currency(item.origin_price) }}元</p>
                  <div v-else>
                    <p class="text-decoration-line-through h6 ">原價{{ $filters.currency(item.origin_price) }}元</p>
                    <p class="fs-4 h5" v-if="item.price">現在只要{{ $filters.currency(item.price) }}元!!</p>
                  </div>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-secondary btn-sm" @click="getProduct(item.id)">查看更多</button>
                    <button class="btn btn-outline-danger btn-sm" :disabled="statusStore.loadingItem === item.id"
                      @click="userCartStore.addCart(item.id)">
                      <div v-if="statusStore.loadingItem === item.id">
                        <div class="spinner-grow spinner-grow-sm" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                        <span>稍待片刻</span>
                      </div>
                      <span v-else>加入購物車</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <UserCartPagination></UserCartPagination>
        </div>
        <UserCart></UserCart>
      </div>
    </div>

    <!-- <ProductModal ref="productModal" @update-complete="handleUpdateComplete"></ProductModal>
    <DeleteProductModal ref="deleteModal"></DeleteProductModal> -->
  </div>
</template>

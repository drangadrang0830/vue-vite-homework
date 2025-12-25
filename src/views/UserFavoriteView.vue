<script setup>
import { useRouter } from 'vue-router'
import useStatusStore from '../stores/statusStore'
import useUserFavoriteStore from '../stores/userFavoriteStore'
import useUserCartStore from '../stores/userCartStore'

const router = useRouter()
const statusStore = useStatusStore()
const userFavoriteStore = useUserFavoriteStore()
const userCartStore = useUserCartStore()

const getProduct = (id) => {
  router.push(`/products/product/${id}`)
}
</script>

<style scoped>
.card {
  cursor: pointer;
}

.card-badgeBg {
  width: 60px;
  height: 60px;
  transform: translate(-50%, -50%) rotate(45deg);
}

.card-badgeImgWarp {
  top: 1%;
  right: 2%;
}

.zoomable-img {
  transition: transform 0.3s ease;

}

.main-image:hover .zoomable-img {
  transform: scale(1.2);
}

.custom-ribbon {
  width: 150px;
  transform: translate(-37%, 4%) rotate(-45deg);
  font-size: 0.8rem;
  pointer-events: none;
}
</style>

<template>
  <div class="container my-4">
    <div class="row row-cols-lg-4 row-cols-md-3 row-cols-2 gx-3 gy-4" v-if="userFavoriteStore.favorites?.length > 0">
      <div class="col" v-for="product in userFavoriteStore.favorites" :key="product.id">
        <div class="card h-100 position-relative overflow-hidden" @click.prevent="getProduct(product.id)">

          <div
            class="custom-ribbon ard-badgeBg bg-danger text-white text-center py-1 fw-bold shadow-sm position-absolute top-0 start-0 z-1"
            v-if="product.origin_price !== product.price">
            <div class="bg-warning py-1">
              <div class="bg-danger">
                特價
              </div>
            </div>
          </div>

          <div class="card-badgeBg position-absolute z-1 top-0 start-100 bg-light"></div>
          <div class="card-badgeImgWarp position-absolute z-2" @click.stop="userFavoriteStore.toggleFavorite(product)"
            style="cursor: pointer;">
            <i :class="userFavoriteStore.isFavorite(product.id) ? 'bi bi-heart-fill text-danger' : 'bi bi-heart'"></i>
          </div>
          <div class="ratio ratio-4x3 overflow-hidden main-image">
            <img :src="product.imagesUrl[0]" class="card-img-top object-fit-cover zoomable-img" alt="圖片顯示失敗">
          </div>

          <div class="card-body text-center d-flex flex-column justify-content-between">
            <h5 class="card-title border-bottom pb-3">{{ product.title }}</h5>
            <div>
              <p class="my-0" :class="product.origin_price !== product.price
                ? 'text-decoration-line-through fs-6'
                : 'fs-5'">
                <span v-if="product.origin_price !== product.price">原價</span>
                <span v-else>售價</span>
                {{ $filters.currency(product.origin_price) }}元
              </p>
              <div v-if="product.origin_price !== product.price">
                <p class="fs-5 text-danger my-0 fw-bold">現在只要{{ $filters.currency(product.price) }}元!!</p>
              </div>
            </div>
          </div>

          <div class="card-footer p-0">
            <button class="btn btn-success btn-sm rounded-top-0 w-100"
              :disabled="statusStore.loadingItem === product.id"
              @click.prevent.stop="userCartStore.addCart(product.id)">
              <div v-if="statusStore.loadingItem === product.id">
                <div class="spinner-grow spinner-grow-sm" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <span>稍待片刻</span>
              </div>
              <span v-else>加入購物車</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-4 p-4 bg-white rounded-4 shadow-sm" v-else>
      <h5>您的收藏是空的</h5>
      <router-link class="btn btn-primary mt-3" to="/products">前往選購商品</router-link>
    </div>
  </div>

</template>

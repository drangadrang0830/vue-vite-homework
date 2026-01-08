<script setup>
import { onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { useRouter } from 'vue-router'
import useStatusStore from '@/stores/statusStore'
import useUserCartStore from '@/stores/frontend/userCartStore'
import useUserProductsStore from '@/stores/frontend/userProductsStore'

const modules = [Pagination, Autoplay]
const userCartStore = useUserCartStore()
const statusStore = useStatusStore()
const userProductsStore = useUserProductsStore()
const router = useRouter()

onMounted(() => {
  userProductsStore.getAllProducts()
})

//切換到產品詳細說明頁面
const getProduct = (id) => {
  router.push(`/product/${id}`)
}
</script>

<style scoped>
:deep(.swiper-wrapper) {
  transition-timing-function: linear !important;
  align-items: stretch;
}

.card:hover {
  border-color: #198754;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1) !important;
}

.swiper-img-wrap {
  height: 150px;
}

.custom-ribbon {
  width: 150px;
  transform: translate(-30%, 15%) rotate(-45deg);
  font-size: 0.85rem;
  z-index: 20;
  pointer-events: none;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #eee;
  cursor: pointer;
  background-color: white;
}
</style>

<template>
  <div class="container my-5">
    <h2 class="text-center mb-4 fw-bold text-danger"><i class="bi bi-fire me-2"></i>限時特惠專區</h2>

    <Swiper v-if="userProductsStore.specialOfferProducts.length > 0" :grabCursor="true" :centeredSlides="false"
      :slidesPerView="2" :loop="true" :speed="8000" :spaceBetween="15" :autoHeight="true" :autoplay="{
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      }" :breakpoints="{ 768: { slidesPerView: 5, spaceBetween: 50 } }" :pagination="{ clickable: true }"
      :modules="modules" class="pb-5 marquee-swiper ">

      <SwiperSlide v-for="product in userProductsStore.specialOfferProducts" :key="product.id">
        <div class="card h-100 position-relative overflow-hidden shadow-sm" @click="getProduct(product.id)">
          <div class="custom-ribbon bg-danger text-white text-center py-1 fw-bold position-absolute top-0 start-0 z-1">
            <div class="bg-warning py-1">
              <div class="bg-danger">特價中</div>
            </div>
          </div>
          <div class="swiper-img-wrap overflow-hidden">
            <img :src="product.imagesUrl[0]" class="card-img-top object-fit-cover w-100 h-100" :alt="product.title">
          </div>
          <div class="card-body text-center d-flex flex-column justify-content-between bg-body">
            <h5 class="card-title">{{ product.title }}</h5>
            <div>
              <del class="text-muted small">原價 {{ $filters.currency(product.origin_price) }}</del>
              <p class="fs-5 text-danger fw-bold mb-0">優惠價 {{ $filters.currency(product.price) }} 元</p>
            </div>
          </div>
          <div class="card-footer p-0 border-0">
            <button class="btn btn-info rounded-0 w-100 py-2" type="button"
              :disabled="statusStore.loadingItem === product.id" @click.stop="userCartStore.addCart(product.id)">
              <span v-if="statusStore.loadingItem === product.id" class="spinner-border spinner-border-sm"></span>
              <span v-else><i class="bi bi-cart-plus me-1"></i>直接加購</span>
            </button>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

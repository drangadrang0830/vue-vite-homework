<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import useUserProductsStore from '@/stores/frontend/userProductsStore'
import useUserCartStore from '@/stores/frontend/userCartStore'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Thumbs, Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/thumbs'
import 'swiper/css/pagination'

const route = useRoute()
const router = useRouter()
const productId = route.params.productId
const userProductsStore = useUserProductsStore()
const userCartStore = useUserCartStore()
const { product, farmProducts } = storeToRefs(userProductsStore)
const isSwiperReady = ref(false)
const qty = ref(1)
const isAdding = ref(false)
const thumbsSwiper = ref(null)
const modules = [FreeMode, Thumbs, Autoplay, Pagination]
const relatedSwiperBreakpoints = {
  576: { slidesPerView: 1 },
  768: { slidesPerView: 2 },
  992: { slidesPerView: 3 },
  1400: { slidesPerView: 4 },
};

onMounted(async () => {
  isSwiperReady.value = false
  await userProductsStore.descriptionProduct(productId)
  await nextTick();
  isSwiperReady.value = true
})

//監視數量變動(負值歸1)
watch(qty, (newValue) => {
  if (newValue === null || newValue === '') return;
  if (newValue < 1) {
    qty.value = 1;
  }
})

//防呆確保數值無0及負數
const validateQty = () => {
  if (qty.value < 1 || !qty.value) {
    qty.value = 1;
  }
}

//Swiper 實體
const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper
}

//加入購物車頁面處理
const addToCart = async (id = productId, count = qty.value) => {
  if (isAdding.value) return
  isAdding.value = true
  try {
    await userCartStore.addCart(id, count)
  } finally {
    isAdding.value = false
  }
}

//篩選出同類商品但去除目前商品
const relatedProducts = computed(() => {
  if (!product.value.category || farmProducts.value.length === 0) return []
  return farmProducts.value.filter(item =>
    item.category === product.value.category && item.id !== product.value.id
  );
})

//下方Swiper分頁調整
const renderCustomPagination = (index, className) => {
  const totalItems = relatedProducts.value.length;
  const startNum = index * 3 + 1;
  const endNum = Math.min(startNum + 3 - 1, totalItems);
  return `<span class="${className}">商品 ${startNum} - ${endNum}</span>`;
}

//返回產品列表頁面
const goBack = () => {
  router.push('/products');
}

</script>

<style scoped>
/* 圖片調整 */
.object-fit-cover {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

/* 購買須知 */
.purchase-info ul {
  list-style: none;
  padding-left: 5px;
}

.purchase-info li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.purchase-info li::before {
  content: '◆';
  position: absolute;
  left: 0;
  color: var(--bs-info);
  font-size: 0.8rem;
  top: 3px;
}

/* Swiper共用 */
:deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ccc;
  opacity: 0.8;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  width: 24px;
  border-radius: 4px;
  background-color: var(--bs-info) !important;
  opacity: 1;
}

/* 上Swiper */
.zoomable-img {
  transition: transform 0.3s ease;
}

.main-image:hover .zoomable-img {
  transform: scale(1.2);
}

/* 下Swiper */
:deep(.thumbs-swiper .swiper-slide-thumb-active .ratio) {
  border: 2px solid var(--bs-info) !important;
  box-shadow: 0 0 5px rgba(var(--bs-info-rgb), 0.5);
}

:deep(.thumbs-swiper .ratio) {
  border: 1px solid #dee2e6;
  transition: all 0.3s ease;
}

:deep(.thumbs-swiper .swiper-slide:hover .ratio) {
  border-color: var(--bs-info);
}
</style>

<template>
  <div class="container my-4" v-if="product.id">
    <nav aria-label="breadcrumb" class="pt-2">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <RouterLink class="link-body-emphasis text-decoration-none" to="/">首頁</RouterLink>
        </li>
        <li class="breadcrumb-item">
          <RouterLink class="link-body-emphasis text-decoration-none" to="/products">農業特產</RouterLink>
        </li>
        <li class="breadcrumb-item">
          {{ product.category.replace('農特產品-', '') }}
        </li>
        <li class="breadcrumb-item text-danger">
          <span>{{ product.title }}</span>
        </li>
      </ol>
    </nav>
    <div class="row my-3">
      <div class="col-lg-6" v-if="isSwiperReady && product.imagesUrl && product.imagesUrl.length > 0">
        <swiper :spaceBetween="10" :thumbs="{ swiper: thumbsSwiper }" :modules="modules"
          class="rounded-4 overflow-hidden">
          <swiper-slide v-for="(img, key) in product.imagesUrl" :key="'main' + key">
            <div class="ratio ratio-4x3">
              <img :src="img" class="object-fit-cover" :alt="product.title" />
            </div>
          </swiper-slide>
        </swiper>
        <swiper @swiper="setThumbsSwiper" :spaceBetween="12" :slidesPerView="5" :freeMode="true"
          :watchSlidesProgress="true" :modules="modules" class="thumbs-swiper mt-3" v-if="product.imagesUrl.length > 1">
          <swiper-slide v-for="(img, key) in product.imagesUrl" :key="'thumb' + key" class="cursor-pointer">
            <div class="ratio ratio-1x1 rounded-2 overflow-hidden border transition-all">
              <img :src="img" class="object-fit-cover" :alt="product.title" />
            </div>
          </swiper-slide>
        </swiper>
      </div>
      <div class="col-lg-6 text-center py-5 border rounded" v-else>
        <p>圖片載入中...</p>
      </div>
      <div class="col-lg-6 d-md-flex flex-column justify-content-between">
        <div class="">
          <h2 class="fw-bold  mt-3 mt-md-0">{{ product.title }}</h2>
          <p class="fs-5">{{ product.description }}</p>
          <p>備註：{{ product.content }}</p>
        </div>
        <div>
          <div class="text-lg-end mt-4">
            <p class="my-0" :class="product.origin_price !== product.price
              ? 'text-decoration-line-through fs-6 text-secondary'
              : 'fs-5'">
              <span v-if="product.origin_price !== product.price">原價</span>
              <span v-else>售價</span>
              {{ $filters.currency(product.origin_price) }}元
            </p>
            <div v-if="product.origin_price !== product.price" class="position-relative">
              <h3 class="fs-4 text-danger fw-bold">現在只要{{ $filters.currency(product.price) }}元!!</h3>
              <img src="@/assets/special-offer.png" alt="特價標示圖"
                class="w-25 d-none d-lg-block start-100 top-50 position-absolute translate-middle-y">
            </div>
          </div>
          <div class="input-group mt-3">
            <span class="input-group-text">數量</span>
            <input type="number" class="form-control text-end" v-model.number="qty" min="1" @blur="validateQty"
              :disabled="isAdding">
            <button class="btn btn-info" type="button" @click="addToCart()" :disabled="isAdding">加到購物車</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-body">
    <div class="container py-3">
      <div class="purchase-info">
        <h3>購買須知</h3>
        <ul>
          <li>農業產品有收成時段，商家不定時會撤下或新增商品。</li>
          <li>因為天然食材、拍攝或螢幕解析等原因，商品的色差可能會有所不同，請以實物為準。</li>
          <li>商品重量可能會因其放置環境及時長而有些微的誤差30克上下，屬於正常範圍。</li>
          <li>若因為季節性或其他不可抗力因素導致無法出貨，我們會及時以電話另行通知。</li>
        </ul>
      </div>
      <div>
        <h3 class="mb-4">探索同分類商品</h3>
        <Swiper :slidesPerView="1" :spaceBetween="20" :loop="false" :modules="modules" :autoHeight="false" :pagination="{
          clickable: true,
          renderCustom: renderCustomPagination
        }" :breakpoints="relatedSwiperBreakpoints" class="related-products-swiper pb-5">
          <SwiperSlide v-for="item in relatedProducts" :key="item.id" class="d-flex h-auto">
            <div class="card h-100 w-100 position-relative overflow-hidden">
              <div class="ratio ratio-4x3 overflow-hidden main-image">
                <img :src="item.imagesUrl?.[0] || 'placeholder.jpg'" class="card-img-top object-fit-cover zoomable-img"
                  :alt="item.title">
              </div>
              <div class="card-body text-center d-flex flex-column justify-content-between">
                <h5 class="card-title border-bottom pb-3">{{ item.title }}</h5>
                <div>
                  <p class="my-0" :class="item.origin_price !== item.price
                    ? 'text-decoration-line-through fs-6'
                    : 'fs-5'">
                    <span v-if="item.origin_price !== item.price">原價</span>
                    <span v-else>售價</span>
                    {{ $filters.currency(item.origin_price) }}元
                  </p>
                  <div v-if="item.origin_price !== item.price">
                    <p class="fs-5 text-danger my-0 fw-bold">現在只要{{ $filters.currency(item.price) }}元!!</p>
                  </div>
                </div>
              </div>
              <div class="card-footer p-0">
                <button class="btn btn-info rounded-top-0 w-100" type="button" @click="addToCart(item.id, 1)">
                  <span>加到購物車</span>
                </button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
        <div class="text-center">
          <button type="button" class="btn btn-lg btn-warning" @click="goBack">
            想看其他商品
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

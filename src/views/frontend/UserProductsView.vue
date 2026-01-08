<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import useStatusStore from '@/stores/statusStore'
import useUserProductsStore from '@/stores/frontend/userProductsStore'
import useUserCartStore from '@/stores/frontend/userCartStore'
import useUserFavoriteStore from '@/stores/frontend/userFavoriteStore'
import SharedPagination from '@/components/shared/SharedPagination.vue'

const router = useRouter()
const statusStore = useStatusStore()
const userProductsStore = useUserProductsStore()
const userCartStore = useUserCartStore()
const userFavoriteStore = useUserFavoriteStore()
const useCategory = ref('全部商品')
const currentPage = ref(1)
const pageSize = 12

onMounted(async () => {
  await userProductsStore.getAllProducts()
  statusStore.resetOrderProgress()
})

//資料預處理
const filterData = (category) => {
  useCategory.value = category
  currentPage.value = 1
}

//分類顯示
const filteredList = computed(() => {
  if (useCategory.value === '全部商品') return userProductsStore.farmProducts
  return userProductsStore.farmProducts.filter(item => item.category?.includes(useCategory.value))
})

//分頁功能(不同於預設10頁切換)---------
const pagedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredList.value.slice(start, end)
})

//處理傳遞用分頁變數
const paginationInfo = computed(() => {
  const total = Math.ceil(filteredList.value.length / pageSize) || 1
  return {
    total_pages: total,
    current_page: currentPage.value,
    has_pre: currentPage.value > 1,
    has_next: currentPage.value < total,
    category: useCategory.value
  }
})

//執行換頁
const changePage = (page) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
//------------------------
//轉往介紹頁
const getProduct = (id) => {
  router.push(`/product/${id}`)
}

</script>

<style scoped>
/* 卡片 */
.card {
  cursor: pointer;
}

.zoomable-img {
  transition: transform 0.3s ease;
}

.main-image:hover .zoomable-img {
  transform: scale(1.2);
}

.card-badgeBg {
  width: 80px;
  height: 80px;
  transform: translate(-50%, -50%) rotate(45deg);
}

.custom-ribbon {
  width: 150px;
  transform: translate(-37%, 4%) rotate(-45deg);
  font-size: 0.8rem;
  pointer-events: none;
}

/* 側邊攔 */
.totem {
  width: 1.5rem;
  height: auto;

}

.list-group-item-action:hover .totem,
.list-group-item-action:focus .totem,
.list-group-item-action.active .totem {
  animation: cart-bounce 0.5s infinite alternate;
}

@keyframes cart-bounce {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-10px);
  }
}

.list-group-item.active {
  background-color: #0dcaf0;
  border-color: #d8d6d6;
  color: rgb(0, 0, 0);
}
</style>

<template>
  <div>
    <h6 class="bg-warning-subtle p-1 m-0 text-center text-danger">目前消費滿1,500元，即送85折優惠劵!</h6>
    <div class="container my-4">
      <div class="row">
        <div class="col-lg-2 mb-4">
          <div class="sticky-top" style="top: calc(var(--nav-height) + 20px);">
            <div class="card border-0 shadow-sm">
              <div class="list-group list-group-flush">
                <button v-for="(category, index) in userProductsStore.categories" :key="index" type="button"
                  class="list-group-item list-group-item-action d-flex align-items-center"
                  :class="{ active: category.name === useCategory }" @click="filterData(category.name)">
                  <img src="@/assets/totem.png" class="totem mx-1" :alt="`${category.name.replace('農特產品-', '')}指示圖`">
                  {{ category.name.replace('農特產品-', '') }}
                  <span class="badge rounded-pill ms-auto"
                    :class="category.name === useCategory ? 'bg-light text-dark' : 'bg-danger'">
                    {{ category.count }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-lg-10">
          <div class="row row-cols-lg-3 row-cols-md-2 row-cols-1 gx-3 gy-4 mb-3">
            <div class="col" v-for="product in pagedList" :key="product.id">
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
                <div class="card-badgeImgWarp position-absolute z-2 p-2 top-0 end-0"
                  @click.stop="userFavoriteStore.toggleFavorite(product)" style="cursor: pointer;">
                  <i
                    :class="userFavoriteStore.isFavorite(product.id) ? 'bi bi-heart-fill text-danger' : 'bi bi-heart'"></i>
                </div>
                <div class="ratio ratio-4x3 overflow-hidden main-image">
                  <img :src="product.imagesUrl[0]" class="card-img-top object-fit-cover zoomable-img"
                    :alt="product.title">
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
                  <button class="btn btn-info rounded-top-0 w-100" type="button"
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
          <div class="d-flex justify-content-center py-4">
            <SharedPagination v-if="paginationInfo.total_pages > 1" :pages="paginationInfo" @emit-pages="changePage" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

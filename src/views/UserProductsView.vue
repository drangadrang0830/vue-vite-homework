<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import useStatusStore from '../stores/statusStore'
import useUserProductsStore from '../stores/userProductsStore'
import useUserCartStore from '../stores/userCartStore'


const statusStore = useStatusStore()
const userProductsStore = useUserProductsStore()
const userCartStore = useUserCartStore()
const router = useRouter()

//-------------------購物車
// import useUserOrder from '../stores/userOrder'
// import UserCart from '../components/UserCart.vue'
// const userOrder = useUserOrder()

//-------------------表單

// const form = ref({
//   user: {
//     name: '',
//     email: '',
//     tel: '',
//     address: '',
//   },
//   message: ''
// })

// const onSubmit = async () => {
//   const orderId = await userOrder.submitOrder(form.value)
//   if (orderId) {
//     router.push(`/user/checkout/${orderId}`)
//     form.value.user = {}
//   }
// }

// const isPhone = (value) => { //電話驗證函式
//   const phoneNumber = /^(09)[0-9]{8}$/
//   return phoneNumber.test(value) ? true : '需要正確的電話號碼'
// }

//-------------------------

const useCategory = ref('全部商品')

// 創建時讀取產品資訊
onMounted(async () => {
  await userProductsStore.getAllProducts();
  // 模板改用 userProductsStore.farmProducts (或計算後的 filterList)
})

const filterData = (category) => {
  useCategory.value = category
}

const filterList = computed(() => {
  if (useCategory.value === '全部商品') return userProductsStore.farmProducts
  return userProductsStore.farmProducts.filter(item => item.category?.includes(useCategory.value))
})

const getProduct = (id) => {
  router.push(`/product/${id}`)
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
</style>

<template>
  <div>
    <LoadingOverlay :active="statusStore.isLoading"></LoadingOverlay>

    <div class="container">
      <div class="row py-3 sticky-top z-2" style="top: var(--nav-height);">
        <div class="col">
          <!-- 選單 -->
          <div class="dropdown d-inline-block position-relative">
            <button class="btn btn-outline-dark bg-info dropdown-toggle" type="button" data-bs-toggle="dropdown">
              選擇顯示類別
            </button>
            <ul class="dropdown-menu">
              <li v-for="(category, index) in userProductsStore.categories" :key="index">
                <a class="dropdown-item d-flex justify-content-between align-items-center"
                  :class="{ active: category.name === useCategory }" href="#"
                  @click.prevent="filterData(category.name)">
                  {{ category.name.replace('農特產品-', '') }}
                  <span class="badge rounded-pill bg-danger ms-3">{{ category.count }}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="row row-cols-lg-5 row-cols-md-2 row-cols-1 gx-3 gy-4 mb-3">
        <div class="col" v-for="product in filterList" :key="product.id">
          <div class="card h-100 position-relative overflow-hidden" @click.prevent="getProduct(product.id)">
            <!-- 封存@click.stop="toggleFavorite(product.id)" -->
            <div class="card-badgeBg position-absolute z-1 top-0 start-100 bg-light"></div>
            <div class="card-badgeImgWarp position-absolute z-2">
              <i class="bi bi-heart"></i>
              <!-- <i class="bi bi-heart-fill text-danger"></i> -->
            </div>
            <img :src="product.imagesUrl[0]" class="card-img-top" alt="圖片顯示失敗" style="height: 150px;">
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

      <!-- 購物車
        <UserCart></UserCart>
        表單
        <div class="col-6 post mt-4" v-if="userCartStore.cartData.carts?.length > 0">
          <v-form v-slot="{ errors }" @submit="onSubmit">

            <div class="mb-3">
              <label for="name" class="form-label">收件人姓名</label>
              <v-field id="name" name="姓名" type="text" class="form-control" :class="{ 'is-invalid': errors['姓名'] }"
                placeholder="請輸入姓名" rules="alpha_dash|required" v-model="form.user.name"></v-field>
              <error-message name="姓名" class="invalid-feedback"></error-message>
            </div>

            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <v-field id="email" name="email" type="email" class="form-control"
                :class="{ 'is-invalid': errors['email'] }" placeholder="請輸入 Email" rules="email|required"
                v-model="form.user.email"></v-field>
              <error-message name="email" class="invalid-feedback"></error-message>
            </div>

            <div class="mb-3">
              <label for="phone" class="form-label">收件人電話</label>
              <v-field id="phone" name="電話" type="text" class="form-control" :class="{ 'is-invalid': errors['電話'] }"
                placeholder="請輸入電話" :rules="isPhone" v-model="form.user.tel"></v-field>
              <error-message name="電話" class="invalid-feedback"></error-message>
            </div>

            <div class="mb-3">
              <label for="address" class="form-label">收件人地址</label>
              <v-field id="address" name="地址" type="text" class="form-control" :class="{ 'is-invalid': errors['地址'] }"
                placeholder="請輸入地址" rules="required" v-model="form.user.address"></v-field>
              <error-message name="地址" class="invalid-feedback"></error-message>
            </div>

            <div class="mb-3">
              <label for="message" class="form-label">留言</label>
              <v-field id="message" name="留言" as="textarea" class="form-control" :class="{ 'is-invalid': errors['留言'] }"
                placeholder="請輸入留言內容" v-model="form.message" rules="max:200" rows="3"></v-field>
              <error-message name="留言" class="invalid-feedback"></error-message>
            </div>

            <div class="text-end">
              <button class="btn btn-primary " type="submit" :disabled="statusStore.isLoading">
                <span v-if="statusStore.isLoading" class="spinner-border spinner-border-sm"></span>
                送出訂單
              </button>
            </div>
          </v-form>
        </div>
      </div>  -->
    </div>
  </div>
</template>

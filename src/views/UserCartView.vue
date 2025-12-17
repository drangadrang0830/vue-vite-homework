<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useStatusStore from '../stores/statusStore'
import useUserProducts from '../stores/userProducts'
import useUserCartStore from '../stores/userCartStore'
import useUserOrder from '../stores/userOrder'
import SharedPagination from '../components/SharedPagination.vue'
import UserCart from '../components/UserCart.vue'

const statusStore = useStatusStore()
const userProducts = useUserProducts()
const userCartStore = useUserCartStore()
const userOrder = useUserOrder()

const router = useRouter()

const form = ref({
  user: {
    name: '',
    email: '',
    tel: '',
    address: '',
  },
  message: ''
})

const onSubmit = async () => {
  const orderId = await userOrder.submitOrder(form.value)
  if (orderId) {
    router.push(`/user/checkout/${orderId}`)
    form.value.user = {}
  }
}

const isPhone = (value) => { //電話驗證函式
  const phoneNumber = /^(09)[0-9]{8}$/
  return phoneNumber.test(value) ? true : '需要正確的電話號碼'
}

// 創建時讀取產品資訊
onMounted(() => {
  userProducts.getProducts();
})

const getProduct = (id) => {
  router.push(`/user/product/${id}`)
}

const handlePageChange = (page) => {
  userProducts.getProducts(page);
};


</script>

<template>
  <div>
    <LoadingOverlay :active="statusStore.isLoading"></LoadingOverlay>
    <div class="container">
      <div class="row mt4 justify-content-center pb-5">
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
          <SharedPagination v-if="userProducts.pagination.total_pages > 1" :pages="userProducts.pagination"
            @emit-pages="handlePageChange">
          </SharedPagination>
        </div>
        <UserCart></UserCart>
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
      </div>
    </div>
  </div>
</template>

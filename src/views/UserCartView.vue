<script setup>
import { ref, onMounted } from 'vue'
import useUserCartStore from '../stores/userCartStore'
import useStatusStore from '../stores/statusStore'

// import useUserOrder from '../stores/userOrder'
// import UserCart from '../components/UserCart.vue'
// const userOrder = useUserOrder()

const userCartStore = useUserCartStore()
const statusStore = useStatusStore()

const code = ref('')

onMounted(() => {
  userCartStore.getCart();
})

const useCouponButton = async () => {
  if (!code.value) {
    statusStore.pushMessage({
      title: `無法使用優惠劵`,
      style: 'danger',
      content: '優惠碼不可為空值',
    })
    return
  }
  await userCartStore.useCoupon(code.value)
  code.value = ''
}

// -------------------表單

//import useUserOrder from '../stores/userOrder'
//import { ref } from 'vue'
//const userOrder = useUserOrder()

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
</script>

<template>
  <!-- 購物車 -->
  <div class="col-md-5 mt-4">
    <div class="sticky-top">
      <table class="table align-middle table-hover">
        <thead>
          <tr class="text-center">
            <th></th>
            <th>品名</th>
            <th style="width: 110px">數量</th>
            <th>單價</th>
          </tr>
        </thead>
        <template v-if="userCartStore.cartData.carts?.length > 0">
          <tbody class="table-group-divider">
            <tr v-for="item in userCartStore.cartData.carts" :key="item.id">
              <td>
                <button type="button" class="btn btn-outline-danger btn-sm" @click="userCartStore.removeCartItem(item)">
                  <i class="bi bi-x-lg"></i>
                </button>
              </td>
              <td class="text-center">
                {{ item.product.title }}
                <div class="text-success" v-if="item.coupon">
                  已套用優惠券
                </div>
              </td>
              <td>
                <div class="input-group input-group-sm">
                  <input type="number" class="form-control" min="1" v-model.number="item.qty"
                    @change="userCartStore.updateCart(item)" :disabled="statusStore.LoadingItem === item.id">
                  <div class="input-group-text">/ {{ item.product.unit }}</div>
                </div>
              </td>
              <td class="text-end">
                <small class="text-success" v-if="item.coupon">折扣價：</small>
                <small>{{ $filters.currency(item.final_total) }}</small>
              </td>
            </tr>
          </tbody>
          <tfoot class="table-group-divider">
            <tr>
              <td colspan="3" class="text-end fw-bold">總計</td>
              <td class="text-end">{{ $filters.currency(userCartStore.cartData.total) }}</td>
            </tr>
            <template v-if="userCartStore.cartData.final_total !== userCartStore.cartData.total">
              <tr>
                <td colspan="3" class="text-end">折扣抵免</td>
                <td class="text-end">{{ Math.floor(userCartStore.cartData.total) -
                  Math.floor(userCartStore.cartData.final_total) }}</td>
              </tr>
              <tr>
                <td colspan="3" class="text-end text-success fw-bold">折扣價</td>
                <td class="text-end text-success">{{ $filters.currency(userCartStore.cartData.final_total) }}</td>
              </tr>
            </template>
          </tfoot>
        </template>
      </table>
      <div class="input-group mb-3 input-group-sm">
        <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="code">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" @click="useCouponButton">
            套用優惠碼
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- 表單
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
</template>

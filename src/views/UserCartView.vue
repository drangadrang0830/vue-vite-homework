<script setup>
import UserCart from '../components/UserCart.vue'

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
  <UserCart></UserCart>
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

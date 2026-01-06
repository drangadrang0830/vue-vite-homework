<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UserProgress from '@/components/frontend/UserProgress.vue'
import useUserOrderStore from '@/stores/frontend/userOrderStore'
import useUserCartStore from '@/stores/frontend/userCartStore'
import useStatusStore from '@/stores/statusStore'

const router = useRouter()
const userOrderStore = useUserOrderStore()
const userCartStore = useUserCartStore()
const statusStore = useStatusStore()

const form = ref({
  user: {
    name: '',
    email: '',
    tel: '',
    address: '',
  },
  message: ''
})

//資料送出
const onSubmit = async () => {
  const orderId = await userOrderStore.submitOrder(form.value)
  if (orderId) {
    router.push(`/checkout/${orderId}`)
    form.value.user = { name: '', email: '', tel: '', address: '' }
  }
}

//電話驗證
const isPhone = (value) => {
  const phoneNumber = /^(09)[0-9]{8}$/
  return phoneNumber.test(value) ? true : '需要正確的電話號碼'
}
</script>

<template>
  <div class="container my-4">
    <UserProgress :step="1" />
    <div class="row  mt-4">
      <div class="col-md-7 my-2" v-if="userCartStore.cartData.carts?.length > 0">
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


          <div class="text-end d-flex justify-content-between">
            <RouterLink class="btn btn-warning" to="/cart">回到購物車</RouterLink>
            <button class="btn btn-success" type="submit" :disabled="statusStore.isLoading">
              <span v-if="statusStore.isLoading" class="spinner-border spinner-border-sm"></span>
              送出訂單
            </button>
          </div>
        </v-form>
      </div>
      <div class="col-md-5 my-2">
        <h4 class="text-center"><i class="bi bi-box-seam-fill"></i> 獅子鄉農特產品宅配須知</h4>
        <table class="table bg-transparent" style="--bs-table-bg: transparent;">
          <!-- 預設定義表格寬度 -->
          <colgroup>
            <col style="width: 25%;">
            <col style="width: 75%;">
          </colgroup>
          <thead>
            <tr>
              <th colspan="2">訂購方式：</th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            <tr>
              <td class="align-top">訂購方式：</td>
              <td>
                <ul class="list-unstyled mb-0">
                  <li>主要透過 獅子鄉聯合行銷網 進行線上訂購。</li>
                  <li>亦會不定期發布季節性蔬菜箱（如產銷履歷蔬菜箱）的預購連結。</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td class="align-top">運費條件：</td>
              <td>部分活動商品（如澎湃禮箱）採含運價（例如 $800 元），具體運費門檻視各項產品而定。</td>
            </tr>
            <tr>
              <td class="align-top">到貨時間：</td>
              <td>下單後通常有固定寄出日期（例如週二寄出），建議於預定到貨日前數天完成訂購。</td>
            </tr>
            <tr>
              <td class="align-top">異常反應：</td>
              <td>若收到商品有問題，應於 24 小時內拍照並聯繫客服處理。</td>
            </tr>
            <tr>
              <td class="align-top">品質保障：</td>
              <td>提供專人客服服務，針對瑕疵商品協助進行退換貨。</td>
            </tr>
            <tr>
              <td class="align-top">特別說明：</td>
              <td>北農也提供「預約交易」模式，主要對象為大宗訂購者（如學校、團膳、公司行號），採預約、分級包裝、直送到點的服務。</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

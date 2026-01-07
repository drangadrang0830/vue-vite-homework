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
    <div class="row mt-4 g-4">

      <div class="col-md-5 my-2">
        <div class="card border-0 shadow h-100">
          <div class="card-header bg-primary text-white py-4"> <!-- 增加 padding -->
            <h5 class="card-title mb-0 text-center fw-bold">
              <i class="bi bi-box-seam-fill me-2"></i>獅子鄉宅配須知
            </h5>
          </div>

          <div class="card-body p-0">
            <ul class="list-group list-group-flush h-100">

              <li class="list-group-item p-3"> <!-- 增加內距 -->
                <div class="d-flex align-items-start">
                  <i class="bi bi-cart-check text-primary me-3 fs-5"></i> <!-- 圖示放大 -->
                  <div>
                    <div class="fw-bold fs-5 mb-1">訂購方式</div>
                    <p class="text-muted mb-0">
                      主要透過獅子鄉聯合行銷網進行線上訂購。
                      <span class="badge rounded-pill bg-info text-dark ms-1">季節限定</span>
                      <br><small>不定期發布產銷履歷蔬菜箱預購連結。</small>
                    </p>
                  </div>
                </div>
              </li>

              <li class="list-group-item p-3">
                <div class="d-flex align-items-start">
                  <i class="bi bi-truck text-primary me-3 fs-5"></i>
                  <div>
                    <div class="fw-bold fs-5 mb-1">運費與配送</div>
                    <p class="text-muted mb-0">
                      活動商品採含運價（如澎湃禮箱 $800）。
                      <br><span class="text-primary fw-bold small"><i class="bi bi-calendar-event"></i> 每週二固定寄出</span>
                    </p>
                  </div>
                </div>
              </li>

              <li class="list-group-item p-3">
                <div class="d-flex align-items-start">
                  <i class="bi bi-shield-check text-success me-3 fs-5"></i>
                  <div>
                    <div class="fw-bold fs-5 mb-1">售後保障</div>
                    <p class="text-muted mb-0">
                      若收到商品有問題，應於 <span class="text-danger fw-bold">24 小時內</span> 拍照並聯繫客服。
                      <br><small>提供專人協助退換貨，保障農產品質。</small>
                    </p>
                  </div>
                </div>
              </li>

              <li class="list-group-item p-3">
                <div class="d-flex align-items-start">
                  <i class="bi bi-building-check text-secondary me-3 fs-5"></i>
                  <div>
                    <div class="fw-bold fs-5 mb-1">大宗採購服務</div>
                    <p class="text-muted mb-0">
                      針對學校、團膳、公司行號提供「預約交易」。
                      <br><small>包含分級包裝與直送到點服務。</small>
                    </p>
                  </div>
                </div>
              </li>

            </ul>
          </div>

          <div class="card-footer bg-transparent text-center border-0 pb-4 mt-auto px-0">
            <div class="px-0 mb-3">
              <p class="small text-secondary border-top pt-3">如有任何問題，歡迎使用線上客服</p>
            </div>
            <RouterLink class="btn btn-warning btn-lg rounded-pill px-5 shadow-sm" to="/cart">
              <i class="bi bi-arrow-left"></i> 返回購物車
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="col-md-7 my-2" v-if="userCartStore.cartData.carts?.length > 0">
        <div class="card border-0 shadow h-100 p-4">
          <h3 class="fw-bold mb-4">填寫發貨資料</h3>
          <v-form v-slot="{ errors }" @submit="onSubmit" class="d-flex flex-column h-100">

            <div class="mb-3">
              <label for="name" class="form-label small fw-bold">收件人姓名</label>
              <v-field id="name" name="姓名" type="text" class="form-control" :class="{ 'is-invalid': errors['姓名'] }"
                placeholder="請輸入姓名" rules="alpha_dash|required" v-model="form.user.name"></v-field>
              <error-message name="姓名" class="invalid-feedback"></error-message>
            </div>

            <div class="mb-3">
              <label for="email" class="form-label small fw-bold">Email</label>
              <v-field id="email" name="email" type="email" class="form-control"
                :class="{ 'is-invalid': errors['email'] }" placeholder="請輸入 Email" rules="email|required"
                v-model="form.user.email"></v-field>
              <error-message name="email" class="invalid-feedback"></error-message>
            </div>

            <div class="mb-3">
              <label for="phone" class="form-label small fw-bold">收件人電話</label>
              <v-field id="phone" name="電話" type="text" class="form-control" :class="{ 'is-invalid': errors['電話'] }"
                placeholder="請輸入電話" :rules="isPhone" v-model="form.user.tel"></v-field>
              <error-message name="電話" class="invalid-feedback"></error-message>
            </div>

            <div class="mb-3">
              <label for="address" class="form-label small fw-bold">收件人地址</label>
              <v-field id="address" name="地址" type="text" class="form-control" :class="{ 'is-invalid': errors['地址'] }"
                placeholder="請輸入地址" rules="required" v-model="form.user.address"></v-field>
              <error-message name="地址" class="invalid-feedback"></error-message>
            </div>

            <div class="mb-4">
              <label for="message" class="form-label small fw-bold">留言<span class="text-secondary">(選填)</span></label>
              <v-field id="message" name="留言" as="textarea" class="form-control" :class="{ 'is-invalid': errors['留言'] }"
                placeholder="請輸入留言內容" v-model="form.message" rules="max:200" rows="3"></v-field>
              <error-message name="留言" class="invalid-feedback"></error-message>
            </div>

            <div class="text-end d-flex justify-content-center mt-auto">

              <button class="btn btn-success btn-lg rounded-pill px-5 shadow-sm" type="submit"
                :disabled="statusStore.isLoading">
                <span v-if="statusStore.isLoading" class="spinner-border spinner-border-sm me-1 "></span>
                <i class="bi bi-send me-1"></i>送出訂單
              </button>
            </div>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

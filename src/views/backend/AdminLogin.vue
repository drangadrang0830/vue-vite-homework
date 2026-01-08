<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useStatusStore from '@/stores/statusStore'
import useAdminApiStore from '@/stores/backend/adminApiStore'
import ToastMessages from '@/components/shared/ToastMessages.vue'
import BiteBtn from '@/components/shared/BiteBtn.vue'

const adminApiStore = useAdminApiStore()
const statusStore = useStatusStore()
const router = useRouter()

//表單輸入綁定
const user = ref(
  {
    username: '',
    password: ''
  }
)

//密碼顯示切換
const isPasswordVisible = ref(false)

//表單送出
const handleLogin = async () => {
  const loginSuccess = await adminApiStore.login(user.value.username, user.value.password)
  if (loginSuccess) {
    router.push('/admin')
  } else {
    user.value.password = ''
  }
}
</script>

<template>
  <div class="container py-5">
    <h1 class="text-center display-4 mb-5">獅子鄉聯合行銷網<br class="d-md-none">後台端系統</h1>
    <div class="row">
      <div class="col-md-7 mx-auto">
        <v-form class="justify-content-center border border-4 border-primary bg-body p-4 rounded-4" v-slot="{ errors }"
          @submit="handleLogin">
          <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
          <div class="mb-2">
            <label for="inputEmail" class="sr-only">Email address</label>
            <v-field id="inputEmail" name="登入信箱" type="email" class="form-control"
              :class="{ 'is-invalid': errors['登入信箱'] }" placeholder="請輸入登入信箱" rules="email|required"
              v-model.trim="user.username" autofocus autocomplete="on" />
            <error-message name="登入信箱" class="invalid-feedback" />
          </div>
          <div class="mb-3">
            <label for="inputPassword" class="form-label">登入密碼</label>
            <div class="input-group has-validation">
              <v-field id="inputPassword" name="登入密碼" :type="isPasswordVisible ? 'text' : 'password'"
                class="form-control rounded-end-0" :class="{ 'is-invalid': errors['登入密碼'] }" rules="required"
                v-model.trim="user.password" autocomplete="current-password" />
              <button class="btn btn-outline-secondary" type="button" @click="isPasswordVisible = !isPasswordVisible">
                <i :class="isPasswordVisible ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
              <error-message name="登入密碼" class="invalid-feedback" />
            </div>
          </div>
          <div class="text-end mt-4">
            <BiteBtn text="登入" size="lg" type="submit" class="btn btn-primary py-2" />
          </div>
        </v-form>
      </div>
    </div>
    <ToastMessages />
    <LoadingOverlay :active="statusStore.isLoading" :z-index="1070" />
  </div>
</template>

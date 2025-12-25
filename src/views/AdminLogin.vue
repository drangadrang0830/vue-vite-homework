<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import useAdminApiStore from '@/stores/AdminApiStore';
import useStatusStore from '../stores/statusStore'

const AdminApiStore = useAdminApiStore()
const statusStore = useStatusStore()
const router = useRouter()
const user = ref(
  {
    username: '',
    password: ''
  }
)

const clearInput = async () => {
  const loginSuccess = await AdminApiStore.login(user.value.username, user.value.password);

  if (loginSuccess) {
    router.push('/dashboardview/productsview')
  }

  user.value.username = '';
  user.value.password = '';
};

</script>

<style scoped>
:deep(body) {

  padding-top: 0 !important;
}
</style>

<template>
  <div class="container mt-5">
    <LoadingOverlay :active="statusStore.isLoading"></LoadingOverlay>
    <form class="row justify-content-center" @submit.prevent="clearInput">
      <div class="col-md-6">
        <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
        <div class="mb-2">
          <label for="inputEmail" class="sr-only">Email address</label>
          <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus
            v-model="user.username" autocomplete="on" />
        </div>
        <div class="mb-2">
          <label for="inputPassword" class="sr-only">Password</label>
          <input type="password" id="inputPassword" class="form-control" placeholder="Password" required
            v-model="user.password" autocomplete="off" @keyup.enter="clearInput" />
        </div>

        <div class="text-end mt-4">
          <button class="btn btn-lg btn-primary btn-block" type="submit">登入</button>
        </div>
      </div>
    </form>
  </div>
</template>

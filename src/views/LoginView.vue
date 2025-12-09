<script setup>
import { ref } from 'vue';

import useApiStore from '@/stores/apiStore';

const apiStore = useApiStore()

const user = ref(
  {
    username: '',
    password: ''
  }
)

const clearInput = async () => {
  // 呼叫 apiStore.login 時傳遞當前值
  await apiStore.login(user.value.username, user.value.password);
  user.value.username = '';
  user.value.password = '';
};

</script>

<template>

  <div class="container mt-5">
    <!-- 送出實質型商店的 login函式-->
    <form class="row justify-content-center" @submit.prevent="clearInput">
      <div class="col-md-6">
        <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
        <div class="mb-2">
          <label for="inputEmail" class="sr-only">Email address</label>
          <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus
            v-model="user.username" />
        </div>
        <div class="mb-2">
          <label for="inputPassword" class="sr-only">Password</label>
          <input type="password" id="inputPassword" class="form-control" placeholder="Password" required
            v-model="user.password" autocomplete />
        </div>

        <div class="text-end mt-4">
          <!-- 這是送出按鈕 不是普通按鈕 -->
          <button class="btn btn-lg btn-primary btn-block" type="submit">登入</button>
        </div>
      </div>
    </form>
  </div>
</template>

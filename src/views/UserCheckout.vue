<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import useUserOrder from '../stores/userOrder'
import useStatusStore from '../stores/statusStore'

const route = useRoute()
const userOrder = useUserOrder()
const statusStore = useStatusStore()

const orderId = route.params.orderId;

const orderDate = ref(null)

const fetchOrder = async () => {
  orderDate.value = await userOrder.getIdOrder(orderId)
}

// 創建時讀取產品資訊
onMounted(async () => {
  await fetchOrder()
})

//表單送出按鈕
const onSubmit = async () => {
  const isPay = await userOrder.payOrder(orderId)
  if (isPay) {
    // router.push(`/user/checkout/${orderId}`)
    await fetchOrder()
  }
}
</script>

<template>
  <div v-if="orderDate" class="my-5 row justify-content-center">
    <form class="col-md-6" @submit.prevent="onSubmit">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>品名</th>
            <th>數量</th>
            <th>單價</th>
          </tr>
        </thead>
        <tbody v-if="orderDate">
          <tr v-for="(item, key) in orderDate.order.products" :key="key">
            <td>{{ item.product.title }}</td>
            <td>{{ item.qty }} / {{ item.product.unit }}</td>
            <td class="text-end">{{ item.final_total }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="text-end">總計</td>
            <td class="text-end">{{ orderDate.order.total }}</td>
          </tr>
        </tfoot>
      </table>

      <table class="table">
        <tbody>
          <tr>
            <th width="100">Email</th>
            <td>{{ orderDate.order.user.email }}</td>
          </tr>
          <tr>
            <th>姓名</th>
            <td>{{ orderDate.order.user.name }}</td>
          </tr>
          <tr>
            <th>收件人電話</th>
            <td>{{ orderDate.order.user.tel }}</td>
          </tr>
          <tr>
            <th>收件人地址</th>
            <td>{{ orderDate.order.user.address }}</td>
          </tr>
          <tr>
            <th>付款狀態</th>
            <td>
              <span v-if="!orderDate.order.is_paid">尚未付款</span>
              <span v-else class="text-success">付款完成</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-end">
        <button class="btn btn-danger" :disabled="statusStore.isLoading">確認付款去</button>
      </div>
    </form>
  </div>
</template>

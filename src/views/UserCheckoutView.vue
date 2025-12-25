<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import useUserOrder from '../stores/userOrderStore'
import useStatusStore from '../stores/statusStore'

const route = useRoute()
const router = useRouter()
const userOrder = useUserOrder()
const statusStore = useStatusStore()

const orderId = route.params.orderId;
const orderDate = ref(null)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));



const fetchOrder = async () => {
  orderDate.value = await userOrder.getIdOrder(orderId)
}

// 創建時讀取產品資訊
onMounted(async () => {
  await fetchOrder();

  if (!orderDate.value || !orderDate.value.success) {
    statusStore.pushMessage({ title: '錯誤', style: 'danger', content: '找不到此訂單' });
    router.replace('/products');
    return;
  }

  if (orderDate.value.order.is_paid) {
    statusStore.pushMessage({
      title: '提示',
      style: 'info',
      content: '此訂單已完成付款'
    });
    router.replace('/products');
  }
})

//表單控制
const isSubmitting = ref(false)

const onSubmit = async () => {
  if (orderDate.value.order.is_paid) return;
  isSubmitting.value = true;
  try {
    const isPay = await userOrder.payOrder(orderId)
    if (isPay) {
      statusStore.setOrderCompleted(true)
      await fetchOrder()
      statusStore.pushMessage({
        title: '訂單已完成',
        style: 'success',
        content: '5秒後將為您跳轉至商品頁面...'
      });
      await delay(5000);
      router.replace('/products')
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="container my-4">
    <div v-if="orderDate" class="my-5 row justify-content-center">
      <form class="col-md-6 bg-white border rounded-4 p-3" @submit.prevent="onSubmit">
        <h4 class="text-center">訂單資訊</h4>
        <table class="table table-borderless">
          <tbody>
            <tr>
              <th>姓名</th>
              <td>{{ orderDate.order.user.name }}</td>
            </tr>
            <tr>
              <th>收件人電話</th>
              <td>{{ orderDate.order.user.tel }}</td>
            </tr>
            <tr>
              <th width="100">Email</th>
              <td>{{ orderDate.order.user.email }}</td>
            </tr>
            <tr>
              <th>收件人地址</th>
              <td>{{ orderDate.order.user.address }}</td>
            </tr>
            <tr>
              <th>付款狀態</th>
              <td>
                <span v-if="!orderDate.order.is_paid" class="text-danger">尚未付款</span>
                <span v-else class="text-success">付款完成</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="row my-3 g-2">

          <div class="col-6">
            <button type="button" class="btn btn-warning w-100"
              :disabled="statusStore.isLoading || isSubmitting || orderDate.order.is_paid"
              @click="$router.push('/products')">
              暫緩付款
            </button>
          </div>

          <div class="col-6">
            <button class="btn btn-danger w-100"
              :disabled="statusStore.isLoading || isSubmitting || orderDate.order.is_paid" type="submit">
              <span v-if="statusStore.isLoading || isSubmitting" class="spinner-border spinner-border-sm me-1"
                role="status"></span>
              {{ orderDate.order.is_paid ? '已完成付款' : '確認付款去' }}
            </button>
          </div>

        </div>

        <div class="accordion rounded-0" id="accordionExample">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                商品明細
              </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <table class="table align-middle table-borderless">
                  <thead>
                    <tr>
                      <th class="w-25"></th>
                      <th>品名</th>
                      <th>數量</th>
                      <th>單價</th>
                    </tr>
                  </thead>
                  <tbody v-if="orderDate">
                    <tr v-for="(item, key) in orderDate.order.products" :key="key">
                      <td><img :src="item.product.imagesUrl[0]" :alt="item.product.title" class="img-fluid rounded-4">
                      </td>
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
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  </div>
</template>

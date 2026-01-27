<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import UserProgress from '@/components/frontend/UserProgress.vue'
import useUserOrderStore from '@/stores/frontend/userOrderStore'
import useStatusStore from '@/stores/statusStore'

const route = useRoute()
const router = useRouter()
const userOrderStore = useUserOrderStore()
const statusStore = useStatusStore()
const orderId = route.params.orderId
const orderData = ref(null)
const isSubmitting = ref(false)
const currentStep = ref(2)

// 排除錯誤訂單
onMounted(async () => {
  await fetchOrder()
  if (!orderData.value || !orderData.value.success) {
    statusStore.pushMessage({ title: '錯誤', style: 'danger', content: '找不到此訂單' })
    router.replace('/products')
    return
  }
  if (orderData.value.order.is_paid) {
    statusStore.pushMessage({ title: '提示', style: 'info', content: '此訂單已完成付款' })
    router.replace('/products')
  }
})

// 頁面讀取訂單處理
const fetchOrder = async () => {
  orderData.value = await userOrderStore.getIdOrder(orderId)
}

// 表單付款功能
const onSubmit = async () => {
  if (orderData.value.order.is_paid) return
  isSubmitting.value = true
  try {
    const isPay = await userOrderStore.payOrder(orderId)
    if (isPay) {
      statusStore.setOrderCompleted(true)
      currentStep.value = 3
      await fetchOrder()
      const totalAmount = orderData.value.order.total

      const swalConfig =
        totalAmount > 1500
          ? {
            title: '感謝您的支持！',
            text: `本次消費已達感恩大回饋門檻。您的85折優惠碼為【ShiziTownship】，請妥善收存`,
            icon: 'success'
          }
          : {
            title: '付款成功！',
            text: '我們將盡快為您安排出貨，感謝您的購買。',
            icon: 'success'
          }
      await Swal.fire({
        ...swalConfig,
        confirmButtonText: '繼續購物去!',
        confirmButtonColor: '#6c757d',
        allowOutsideClick: false
      })

      router.replace('/products')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.custom-table {
  table-layout: fixed;
  width: 100%;
}

/* 針對行動版與桌機版的比例調整 */
.col-img {
  width: 0%;
}

/* 手機版隱藏 */
.col-name {
  width: 40%;
}

.col-qty {
  width: 30%;
}

.col-price {
  width: 30%;
}

@media (min-width: 768px) {
  .col-img {
    width: 30%;
  }

  .col-name {
    width: 30%;
  }

  .col-qty {
    width: 20%;
  }

  .col-price {
    width: 20%;
  }
}
</style>

<template>
  <div class="container my-4">
    <UserProgress :step="currentStep" />
    <div v-if="orderData" class="my-5 row justify-content-center">
      <form class="col-md-6 bg-body border rounded-4 p-3" @submit.prevent="onSubmit">
        <h4 class="text-center fs-4 fw-bold">訂單資訊</h4>
        <div v-if="!orderData.order.is_paid" class="alert alert-danger text-center fw-bold fs-5" role="alert">
          應付總金額：{{ $filters.currency(orderData.order.total) }}
        </div>

        <div class="mb-3 pb-2">
          <div class="row gy-2">
            <!-- 姓名 -->
            <div class="col-12 col-md-3 fw-bold">姓名</div>
            <div class="col-12 col-md-9 text-muted">
              {{ orderData.order.user.name }}
            </div>
            <!-- 電話 -->
            <div class="col-12 col-md-3 fw-bold">收件人電話</div>
            <div class="col-12 col-md-9 text-muted">
              {{ orderData.order.user.tel }}
            </div>

            <!-- Email -->
            <div class="col-12 col-md-3 fw-bold">Email</div>
            <div class="col-12 col-md-9 text-break text-muted">
              {{ orderData.order.user.email }}
            </div>

            <!-- 地址 -->
            <div class="col-12 col-md-3 fw-bold">收件人地址</div>
            <div class="col-12 col-md-9 text-muted">
              {{ orderData.order.user.address }}
            </div>

            <!-- 付款狀態 -->
            <div class="col-12 col-md-3 fw-bold">付款狀態</div>
            <div class="col-12 col-md-9 text-muted">
              <span v-if="!orderData.order.is_paid" class="text-danger">尚未付款</span>
              <span v-else class="text-success">付款完成</span>
            </div>
          </div>
        </div>

        <div class="row mb-3 g-2">
          <div class="col-6">
            <button type="button" class="btn btn-secondary w-100"
              :disabled="statusStore.isLoading || isSubmitting || orderData.order.is_paid"
              @click="$router.push('/products')">
              稍後付款
            </button>
          </div>
          <div class="col-6">
            <button class="btn btn-info w-100"
              :disabled="statusStore.isLoading || isSubmitting || orderData.order.is_paid" type="submit">
              <span v-if="statusStore.isLoading || isSubmitting" class="spinner-border spinner-border-sm me-1"
                role="status"></span>
              {{ orderData.order.is_paid ? '已完成付款' : '確認付款去' }}
            </button>
          </div>
        </div>
        <div class="accordion rounded-0" id="accordionExample">
          <div class="accordion-item">
            <h2 class="accordion-header">
              <button class="accordion-button collapsed fs-4 fw-bold" type="button" data-bs-toggle="collapse"
                data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                商品明細
              </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
              <div class="accordion-body">
                <table class="table align-middle table-borderless custom-table">
                  <thead>
                    <tr>
                      <!-- 第一欄：圖片 (手機版 0% / MD 30%) -->
                      <th class="d-none d-md-table-cell col-img">
                        <span class="fs-5">品名</span>
                      </th>

                      <!-- 第二欄：名稱 (手機版 40% / MD 30%) -->
                      <th class="fs-5 col-name">
                        <span class="d-inline d-md-none">品名</span>
                      </th>

                      <!-- 第三欄：數量 (手機版 30% / MD 20%) -->
                      <th class="text-end fs-5 col-qty">數量</th>

                      <!-- 第四欄：單價 (手機版 30% / MD 20%) -->
                      <th class="text-end fs-5 col-price">單價</th>
                    </tr>
                  </thead>

                  <tbody v-if="orderData">
                    <tr v-for="(item, key) in orderData.order.products" :key="key">
                      <td class="d-none d-md-table-cell">
                        <img :src="item.product.imagesUrl[0]" :alt="item.product.title" class="img-fluid rounded-4" />
                      </td>
                      <td class="text-break">{{ item.product.title }}</td>
                      <td class="text-end">{{ item.qty }} / {{ item.product.unit }}</td>
                      <td class="text-end">{{ $filters.currency(item.final_total) }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td class="d-none d-md-table-cell"></td>
                      <td></td>
                      <td class="text-end fw-bold fs-5">總計</td>
                      <td class="text-end fw-bold">
                        {{ $filters.currency(orderData.order.total) }}
                      </td>
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

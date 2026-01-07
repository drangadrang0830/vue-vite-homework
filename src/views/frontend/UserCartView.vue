<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UserCartCarousel from '@/components/frontend/UserCartCarousel.vue'
import UserProgress from '@/components/frontend/UserProgress.vue'
import useUserCartStore from '@/stores/frontend/userCartStore'
import useStatusStore from '@/stores/statusStore'

const userCartStore = useUserCartStore()
const statusStore = useStatusStore()
const router = useRouter()
const code = ref('')

onMounted(async () => {
  await userCartStore.getCart()
})

const toOrder = () => {
  router.push(`/order`)
}

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
</script>

<template>
  <div class="container my-4">

    <UserProgress v-if="userCartStore.cartData.carts?.length > 0" :step="0" />

    <div class="row g-5 my-4" v-if="userCartStore.cartData.carts?.length > 0">
      <div class="col-md-8">
        <table class="table align-middle table-hover" style="--bs-table-bg: transparent;">
          <thead>
            <tr class="text-center">
              <th></th>
              <th style="width: 20%" class="d-none d-lg-table-cell">圖片</th>
              <th>品名</th>
              <th style="width: 20%">數量</th>
              <th class="d-none d-lg-table-cell text-end" style="width: 10%">單價</th>
              <th class="text-end" style="width: 10%">總價</th>
            </tr>
          </thead>
          <template v-if="userCartStore.cartData.carts?.length > 0">
            <tbody class="table-group-divider">
              <tr v-for="item in userCartStore.cartData.carts" :key="item.id">

                <td>
                  <a href="#" @click.prevent="userCartStore.removeCartItem(item)"><i
                      class="bi bi-x-lg text-danger p-2"></i></a>
                </td>

                <td class="d-none d-lg-table-cell">
                  <img :src="item.product.imagesUrl[0]" :alt="item.product.title" class="img-fluid">
                </td>

                <td class="text-center">
                  {{ item.product.title }}
                  <div class="text-success" v-if="item.coupon">
                    <div class="d-none d-lg-block">
                      已套用優惠券
                    </div>
                  </div>
                </td>

                <td>
                  <div class="input-group input-group-sm">
                    <input type="number" class="form-control w-50 text-end bg-body" min="1" v-model.number="item.qty"
                      @change="userCartStore.updateCart(item)" :disabled="statusStore.loadingItem === item.id">
                    <div class="input-group-text w-50 text-center d-none d-lg-block bg-body">/ {{
                      item.product.unit
                      }}</div>
                  </div>
                </td>

                <td class="text-end d-none d-lg-table-cell">
                  {{ $filters.currency(item.product.price) }}
                </td>

                <td class="text-end">
                  {{ $filters.currency(item.final_total) }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="6" class="text-end fw-bold">
                  <RouterLink class="btn btn-warning" to="/products">繼續選購</RouterLink>
                </td>
              </tr>
            </tfoot>
          </template>
        </table>
      </div>

      <div class="col-md-4">
        <div class="card border-0 shadow">
          <div class="card-body">
            <h5 class="card-title fw-bold mb-4">結帳明細</h5>

            <div class="d-flex justify-content-between mb-3">
              <span class="text-muted">金額計算</span>
              <span class="fw-bold">{{ $filters.currency(userCartStore.cartData.total) }}</span>
            </div>

            <div v-if="!userCartStore.cartData.carts[0]?.coupon" class="mb-3">
              <div class="input-group">
                <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="code">
                <button class="btn btn-outline-success" type="button" @click="useCouponButton">
                  套用
                </button>
              </div>
            </div>

            <template v-if="userCartStore.cartData.carts[0]?.coupon">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">優惠劵名稱</span>
                <span>{{ userCartStore.cartData.carts[0]?.coupon?.title }}</span>
              </div>
              <div class="d-flex justify-content-between mb-3">
                <span class="text-muted">折扣比例</span>
                <span class="text-danger">-{{ 100 - userCartStore.cartData.carts[0].coupon?.percent }}%</span>
              </div>
            </template>

            <hr class="my-3">
            <template v-if="userCartStore.cartData.final_total !== userCartStore.cartData.total">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">折扣抵免</span>
                <span class="text-danger fw-bold">
                  -{{ $filters.currency(Math.floor(userCartStore.cartData.total) -
                    Math.floor(userCartStore.cartData.final_total)) }}
                </span>
              </div>
            </template>
            <div class="d-flex justify-content-between align-items-end mb-4">
              <span class="fw-bold">總計金額</span>
              <span class="fs-4 fw-bold" :class="{
                'text-success': userCartStore.cartData.final_total !== userCartStore.cartData.total,
                'text-dark': userCartStore.cartData.final_total === userCartStore.cartData.total
              }">
                {{ $filters.currency(userCartStore.cartData.final_total || userCartStore.cartData.total) }}
              </span>
            </div>

            <button class="btn btn-success w-100 py-2 fw-bold" type="button" @click="toOrder()">
              填寫收件資料
            </button>
          </div>
        </div>
      </div>

    </div>

    <div v-else class="text-center p-4 bg-body text-body rounded-4 shadow-sm">
      <h5>您的購物車是空的</h5>
      <RouterLink class="btn btn-info mt-3" to="/products">前往選購商品</RouterLink>
    </div>

    <UserCartCarousel />
  </div>
</template>

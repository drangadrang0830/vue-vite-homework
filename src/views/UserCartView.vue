<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import useUserCartStore from '../stores/userCartStore'
import useStatusStore from '../stores/statusStore'

const userCartStore = useUserCartStore()
const statusStore = useStatusStore()
const router = useRouter()

const code = ref('')

onMounted(() => {
  userCartStore.getCart();
})

const toOrder = () => {
  router.push(`/products/order`)
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
  <!-- 購物車 -->
  <div class="row">
    <div class="col-md-8 mt-4 ">
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
                  <div class="input-group-text w-50 text-center d-none d-lg-block">/ {{
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
                <router-link class="btn btn-warning" to="/products" @click="isNavOpen = false">繼續選購</router-link>
              </td>
            </tr>
          </tfoot>
        </template>
      </table>
    </div>

    <div class="col-md-4 mt-4">
      <table class="table align-middle table-hover table-borderless" style="--bs-table-bg: transparent;">
        <thead>
          <tr>
            <th colspan="2" class="fw-bold">金額計算：</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td class="text-end">金額總計</td>
            <td class="text-end fw-bold">{{ $filters.currency(userCartStore.cartData.total) }}</td>
          </tr>

          <tr>
            <td colspan="2" class="text-end">
              <div class="input-group">
                <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="code">
                <button class="btn btn-outline-secondary" type="button" @click="useCouponButton">
                  套用優惠碼
                </button>
              </div>
            </td>
          </tr>

          <template v-if="userCartStore.cartData.final_total !== userCartStore.cartData.total">
            <tr>
              <td class="text-end">折扣抵免</td>
              <td class="text-end text-danger fw-bold">{{ $filters.currency(Math.floor(userCartStore.cartData.total) -
                Math.floor(userCartStore.cartData.final_total)) }}</td>
            </tr>
            <tr>
              <td class="text-end">折扣後價格</td>
              <td class="text-end text-success fw-bold">{{ $filters.currency(userCartStore.cartData.final_total) }}</td>
            </tr>
          </template>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2">
              <button class="btn btn-success w-100" type="button" @click="toOrder()">
                下一頁
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

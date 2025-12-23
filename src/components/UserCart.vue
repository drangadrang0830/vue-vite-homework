<script setup>
import { ref, onMounted } from 'vue'
import useUserCartStore from '../stores/userCartStore'
import useStatusStore from '../stores/statusStore'

// import useUserOrder from '../stores/userOrder'
// import UserCart from '../components/UserCart.vue'
// const userOrder = useUserOrder()

const userCartStore = useUserCartStore()
const statusStore = useStatusStore()

const code = ref('')

onMounted(() => {
  userCartStore.getCart();
})

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
  <div class="col-md-5 mt-4">
    <div class="sticky-top">
      <table class="table align-middle table-hover">
        <thead>
          <tr class="text-center">
            <th></th>
            <th>品名</th>
            <th style="width: 110px">數量</th>
            <th>單價</th>
          </tr>
        </thead>
        <template v-if="userCartStore.cartData.carts?.length > 0">
          <tbody class="table-group-divider">
            <tr v-for="item in userCartStore.cartData.carts" :key="item.id">
              <td>
                <button type="button" class="btn btn-outline-danger btn-sm" @click="userCartStore.removeCartItem(item)">
                  <i class="bi bi-x-lg"></i>
                </button>
              </td>
              <td class="text-center">
                {{ item.product.title }}
                <div class="text-success" v-if="item.coupon">
                  已套用優惠券
                </div>
              </td>
              <td>
                <div class="input-group input-group-sm">
                  <input type="number" class="form-control" min="1" v-model.number="item.qty"
                    @change="userCartStore.updateCart(item)" :disabled="statusStore.LoadingItem === item.id">
                  <div class="input-group-text">/ {{ item.product.unit }}</div>
                </div>
              </td>
              <td class="text-end">
                <small class="text-success" v-if="item.coupon">折扣價：</small>
                <small>{{ $filters.currency(item.final_total) }}</small>
              </td>
            </tr>
          </tbody>
          <tfoot class="table-group-divider">
            <tr>
              <td colspan="3" class="text-end fw-bold">總計</td>
              <td class="text-end">{{ $filters.currency(userCartStore.cartData.total) }}</td>
            </tr>
            <template v-if="userCartStore.cartData.final_total !== userCartStore.cartData.total">
              <tr>
                <td colspan="3" class="text-end">折扣抵免</td>
                <td class="text-end">{{ Math.floor(userCartStore.cartData.total) -
                  Math.floor(userCartStore.cartData.final_total) }}</td>
              </tr>
              <tr>
                <td colspan="3" class="text-end text-success fw-bold">折扣價</td>
                <td class="text-end text-success">{{ $filters.currency(userCartStore.cartData.final_total) }}</td>
              </tr>
            </template>
          </tfoot>
        </template>
      </table>
      <div class="input-group mb-3 input-group-sm">
        <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="code">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" @click="useCouponButton">
            套用優惠碼
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

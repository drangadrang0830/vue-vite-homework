<script setup>
import useUserCartStore from '../stores/userCartStore'

const userCartStore = useUserCartStore()
</script>

<template>
  <div class="col-md-5">
    <div class="sticky-top">
      <table class="table align-middle">
        <thead>
          <tr>
            <th></th>
            <th>品名</th>
            <th style="width: 110px">數量</th>
            <th>單價</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in userCartStore.cartData.carts" :key="item.id">
            <td>
              <button type="button" class="btn btn-outline-danger btn-sm">
                刪除
              </button>
            </td>
            <td>
              {{ item.product.title }}
              <div class="text-success" v-if="item.coupon">
                已套用優惠券
              </div>
            </td>
            <td>
              <div class="input-group input-group-sm">
                <input type="number" class="form-control" :value="item.qty">
                <div class="input-group-text">/ 單位</div>
              </div>
            </td>
            <td class="text-end">
              {{ $filters.currency(item.final_total) }}
              <small class="text-success" v-if="item.coupon">折扣價：</small>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="text-end">總計</td>
            <td class="text-end">{{ $filters.currency(userCartStore.cartData.final_total) }}</td>
          </tr>
          <tr v-if="userCartStore.cartData.final_total !== userCartStore.cartData.total">
            <td colspan="3" class="text-end text-success">折扣價</td>
            <td class="text-end text-success">{{ userCartStore.cartData.total - userCartStore.cartData.final_total }}
            </td>
          </tr>
        </tfoot>
      </table>
      <div class="input-group mb-3 input-group-sm">
        <input type="text" class="form-control" placeholder="請輸入優惠碼">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button">
            套用優惠碼
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useModal } from '../composables/useModal'

const { modalElement, openModal } = useModal()

const tempOrder = ref({
  user: {},
  products: {}
})

const show = (item) => {
  tempOrder.value = JSON.parse(JSON.stringify(item))
  openModal()
}

defineExpose({
  openModal: show
})
</script>

<template>
  <div class="modal fade" tabindex="-1" ref="modalElement">
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0 shadow">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title">
            <i class="bi bi-file-earmark-text me-2"></i>訂單細節
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body" v-if="tempOrder.id">
          <div class="row">
            <div class="col-md-4">
              <h6 class="fs-3 fw-bold pb-2">用戶資料</h6>
              <table class="table">
                <thead>
                  <tr class="fs-6 border-bottom">
                    <td class="fw-bold">姓名</td>
                    <td>{{ tempOrder.user.name }}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr class="fs-6 border-bottom">
                    <td class="fw-bold">Email</td>
                    <td>{{ tempOrder.user.email }}</td>
                  </tr>
                  <tr class="fs-6 border-bottom">
                    <td class="fw-bold">電話</td>
                    <td>{{ tempOrder.user.tel }}</td>
                  </tr>
                  <tr class="fs-6 border-bottom">
                    <td class="fw-bold">地址</td>
                    <td>{{ tempOrder.user.address }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-md-8">
              <h6 class="fs-3 fw-bold pb-2">訂單細節</h6>
              <table class="table">
                <thead>
                  <tr class="fs-6 border-bottom">
                    <td class="fw-bold">訂單編號</td>
                    <td>{{ tempOrder.id }}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr class="fs-6 border-bottom">
                    <td class="fw-bold">下單時間</td>
                    <td>{{ $filters.date(tempOrder.create_at) }}</td>
                  </tr>
                  <tr class="fs-6 border-bottom">
                    <td class="fw-bold">付款時間</td>
                    <td>{{ tempOrder.paid_at ? $filters.date(tempOrder.paid_at) : '尚未付款' }}</td>
                  </tr>
                  <tr class="fs-6 border-bottom">
                    <td class="fw-bold">付款狀態</td>
                    <td>
                      <span v-if="tempOrder.is_paid" class="text-success fw-bold">已付款</span>
                      <span v-else class="text-danger fw-bold">尚未付款</span>
                    </td>
                  </tr>
                  <tr class="fs-6 border-bottom">
                    <td class="fw-bold">總金額</td>
                    <td>{{ $filters.currency(tempOrder.total) }}</td>
                  </tr>
                </tbody>
              </table>

              <h6 class="fs-3 fw-bold pb-2">選購商品</h6>
              <table class="table">
                <thead>
                  <tr class="fs-6 border-bottom fw-bold">
                    <td>品名</td>
                    <td class="text-center">數量</td>
                    <td class="text-end">小計</td>
                  </tr>
                </thead>
                <tbody>
                  <tr class="fs-6 border-bottom" v-for="p in tempOrder.products" :key="p.id">
                    <td class="fw-bold">{{ p.product.title }}</td>
                    <td class="text-center">{{ p.qty }} / {{ p.product.unit }}</td>
                    <td class="text-end">{{ $filters.currency(p.total) }}</td>
                  </tr>
                </tbody>
              </table>

            </div>
          </div>
        </div>
        <div class="modal-footer bg-light">
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal">確認</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
li {
  font-size: 0.9rem;
}
</style>

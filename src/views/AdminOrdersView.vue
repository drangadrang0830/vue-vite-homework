<script setup>
import { onMounted, ref, } from 'vue'
import OrderModal from '../components/OrderModal.vue'
import useUserOrder from '../stores/userOrderStore'
import SharedPagination from '../components/SharedPagination.vue'
import AdminDeleteModal from '../components/AdminDeleteModal.vue'
import useAdminOrderStore from '../stores/adminOrderStore'

const adminOrderStore = useAdminOrderStore()
const userOrder = useUserOrder()

const orderModalRef = ref(null);
const deleteModal = ref(null);


const openOrderDetailModal = (orderItem) => {
  orderModalRef.value.openModal(orderItem);
}

const openDeleteOrder = (order) => {
  const displayItem = {
    ...order,
    title: `訂單編號: ${order.id.substring(0, 8)} (${order.user.email})`
  };

  deleteModal.value.openModal(displayItem, async (target) => {
    const success = await adminOrderStore.deleteOrder(target.id);
    if (success) {
      adminOrderStore.getOrders();
    }
  });
};

onMounted(() => {
  adminOrderStore.getOrders();
})

const changeCheckbox = async (orderId) => {
  const isPay = await userOrder.payOrder(orderId)
  if (isPay) {
    await adminOrderStore.getOrders()
  }
}

const handlePageChange = (page) => {
  adminOrderStore.getOrders(page);
};

const getCouponInfo = (order) => {
  const firstProductKey = Object.keys(order.products);
  if (firstProductKey.length === 0) return null;
  const firstProduct = order.products[firstProductKey[0]];
  if (firstProduct.coupon && typeof firstProduct.coupon.percent === 'number') {

    const discountPercent = 100 - firstProduct.coupon.percent;

    return {
      title: firstProduct.coupon.title,
      discount: discountPercent
    };
  }
  return null;
};
</script>

<template>
  <div>

    <div class="container-fluid d-lg-none p-0">
      <div class="row g-3" v-if="adminOrderStore.orders.length > 0">
        <div class="col-12" v-for="order in adminOrderStore.orders" :key="order.id">
          <div class="card h-100 shadow-sm border-0 mt-4">
            <div class="card-body p-3">
              <!-- 第一行：訂單時間與金額 -->
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <span class="badge bg-light text-dark border me-1">訂單日期</span>
                  <span class="small text-muted">{{ $filters.date(order.create_at) }}</span>
                </div>
                <div class="fw-bold text-danger">
                  {{ $filters.currency(order.total) }}
                </div>
              </div>

              <!-- 第二行：Email (手機版通常較長，故獨立一行) -->
              <p class="small mb-2">
                <i class="bi bi-envelope me-1"></i>{{ order.user.email }}
              </p>

              <!-- 第三行：購買品項列表 -->
              <div class="bg-light p-2 rounded mb-3 small">
                <div v-for="product in order.products" :key="product.id" class="mb-1">
                  {{ product.product.title }}
                  <span class="text-muted">x {{ product.qty }} {{ product.product.unit }}</span>
                </div>
              </div>

              <div v-if="getCouponInfo(order)" class="mb-3 small text-success fw-bold">
                <i class="bi bi-tag-fill me-1"></i>
                已使用{{ getCouponInfo(order).title }}優惠券 (已折抵 {{ getCouponInfo(order).discount }}%)
              </div>

              <!-- 第四行：付款狀態切換與操作按鈕 -->
              <div class="d-flex align-items-center justify-content-between border-top pt-3">
                <div class="form-check form-switch mb-0">
                  <input class="form-check-input" type="checkbox" :id="`mobilePaymentSwitch-${order.id}`"
                    :checked="order.is_paid" @change="changeCheckbox(order.id)">
                  <label class="form-check-label small" :for="`mobilePaymentSwitch-${order.id}`">
                    <span v-if="!order.is_paid">尚未付款</span>
                    <span v-else class="text-success fw-bold">付款完成</span>
                  </label>
                </div>

                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-primary" @click="openOrderDetailModal(order)">檢視</button>
                  <button class="btn btn-sm btn-outline-danger" @click="openDeleteOrder(order)">刪除</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5 text-muted">
        目前尚無訂單資料
      </div>
    </div>

    <table class="table my-4 d-none d-lg-table table-hover align-middle">
      <thead>
        <tr class="text-center">
          <th>購買時間</th>
          <th>Email</th>
          <th>購買款項</th>
          <th>應付金額</th>
          <th>優惠券</th>
          <th>是否付款</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in adminOrderStore.orders" :key="order.id">
          <td class="text-center">{{ $filters.date(order.create_at) }}</td>
          <td>{{ order.user.email }}</td>
          <td>
            <p v-for="product in order.products" :key="product.id">{{ product.product.title }} 數量： {{ product.qty }} {{
              product.product.unit }}</p>
          </td>

          <td class="text-center">
            {{ $filters.currency(order.total) }}
          </td>

          <td class="text-center">
            <span v-if="getCouponInfo(order)" class="text-success">
              {{ getCouponInfo(order).title }}優惠券 <br>(已折抵 {{ getCouponInfo(order).discount }}%)
            </span>
            <span v-else>
              未使用
            </span>
          </td>

          <td class="text-center ">
            <div class="form-check form-switch d-flex align-items-center justify-content-center">
              <input class="form-check-input" type="checkbox" :id="`paymentStatusSwitch-${order.id}`"
                :checked="order.is_paid" @change="changeCheckbox(order.id)" :disabled="order.is_paid">
              <label class="form-check-label ms-2" :for="`paymentStatusSwitch-${order.id}`">
                <span v-if="!order.is_paid">尚未付款</span>
                <span v-else class="text-success">付款完成</span>
              </label>
            </div>
          </td>

          <td class="text-center">
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" @click="openOrderDetailModal(order)">檢視</button>
              <button class="btn btn-outline-danger btn-sm" @click="openDeleteOrder(order)">刪除</button>
            </div>
          </td>

        </tr>
      </tbody>
    </table>
    <SharedPagination v-if="adminOrderStore.pagination.total_pages > 1" :pages="adminOrderStore.pagination"
      @emit-pages="handlePageChange">
    </SharedPagination>
    <OrderModal ref="orderModalRef"></OrderModal>
    <AdminDeleteModal ref="deleteModal" />
  </div>
</template>

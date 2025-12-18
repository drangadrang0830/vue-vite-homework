<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useUserProducts from '../stores/userProducts'
import useUserCartStore from '../stores/userCartStore'
import useStatusStore from '../stores/statusStore'

const route = useRoute()
const userProducts = useUserProducts()
const userCartStore = useUserCartStore()
const statusStore = useStatusStore()

const productId = route.params.productId;

const router = useRouter()

onMounted(() => {
  userProducts.descriptionProduct(productId)
})

const getImageClass = (key) => {
  if (!userProducts.product.imagesUrl || userProducts.product.imagesUrl.length === 1) {
    return 'col-12';
  }
  if (key <= 1) {
    return 'col-6';
  }
  const totalSubImages = userProducts.product.imagesUrl.length - 2;
  const cols = 12 / totalSubImages;
  return `col-${cols}`;
};

const addCartToUser = async () => {
  await userCartStore.addCart(productId)
  router.push(`/user/cart`)
}

</script>

<template>
  <LoadingOverlay :active="statusStore.isLoading"></LoadingOverlay>
  <div class="container" v-if="userProducts.product.id">
    <div class="row mt-3">
      <div class="col-8">
        <h1>{{ userProducts.product.title }}</h1>
        <p>{{ userProducts.product.description }}</p>
        <div class="row">
          <img :class="getImageClass(key)" class="img-fluid py-2 " :src="img" alt=""
            v-for="(img, key) in userProducts.product.imagesUrl" :key="img">
        </div>

      </div>
      <div class="col-4 ms-auto">
        <p class="text-decoration-line-through h5" v-if="!userProducts.product.price">
          原價{{ $filters.currency(userProducts.product.origin_price) }}元</p>
        <div v-else>
          <p class="text-decoration-line-through h6 ">原價{{ $filters.currency(userProducts.product.origin_price) }}元</p>
          <p class="fs-4 h5" v-if="userProducts.product.price">現在只要{{ $filters.currency(userProducts.product.price)
            }}元!!</p>
        </div>
        <button class="btn btn-outline-danger btn-sm" @click="addCartToUser">加到購物車</button>
      </div>
    </div>
  </div>
</template>

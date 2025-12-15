<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import useUserProducts from '../stores/userProducts'

const route = useRoute()
const userProducts = useUserProducts()

const productId = route.params.productId;

onMounted(() => {
  userProducts.descriptionProduct(productId)
})

const getImageClass = (key) => {
  if (key === 0) {
    return 'col-12';
  }
  const totalSubImages = userProducts.product.imagesUrl.length - 1;
  const cols = 12 / totalSubImages;
  return `col-${cols}`;
};

</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-8">
        <h1>{{ userProducts.product.title }}</h1>
        <p>敘述</p>
        <div class="row">
          <img :class="getImageClass(key)" class="img-fluid py-2" :src="img" alt=""
            v-for="(img, key) in userProducts.product.imagesUrl" :key="img">
        </div>

      </div>
      <div class="col-4">
        <p class="text-decoration-line-through h5" v-if="!userProducts.product.price">
          原價{{ $filters.currency(userProducts.product.origin_price) }}元</p>
        <div v-else>
          <p class="text-decoration-line-through h6 ">原價{{ $filters.currency(userProducts.product.origin_price) }}元</p>
          <p class="fs-4 h5" v-if="userProducts.product.price">現在只要{{ $filters.currency(userProducts.product.price)
          }}元!!</p>
        </div>
        <button class="btn btn-outline-danger btn-sm">加到購物車</button>
      </div>
    </div>
  </div>
</template>

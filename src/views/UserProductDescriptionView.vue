<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useUserProductsStore from '../stores/userProductsStore'
import useUserCartStore from '../stores/userCartStore'

const route = useRoute()
const router = useRouter()
const userProductsStore = useUserProductsStore()
const userCartStore = useUserCartStore()

const productId = route.params.productId;
const { product } = storeToRefs(userProductsStore);

onMounted(() => {
  userProductsStore.descriptionProduct(productId)
})

//圖片排版
const getImageClass = (key) => {
  if (!product.value.imagesUrl || product.value.imagesUrl.length === 1) {
    return 'col-12';
  }
  if (key <= 1) {
    return 'col-md-6';
  }
  const totalSubImages = product.value.imagesUrl.length - 2;
  const cols = 12 / totalSubImages;
  return `col-${cols}`;
};

const addCartToUser = async () => {
  await userCartStore.addCart(productId)
  router.push(`/products`)
}

</script>

<style scoped></style>

<template>
  <div class="container" v-if="product.id">
    <nav aria-label="breadcrumb" class="pt-2">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link class="link-body-emphasis text-decoration-none" to="/products">農業特產</router-link>
        </li>
        <li class="breadcrumb-item">
          <span>{{ product.title }}</span>
        </li>
      </ol>
    </nav>

    <div class="row my-3">
      <div class="col-lg-6">
        <div class="row g-3">
          <img :class="getImageClass(key)" class="img-fluid rounded-3" :src="img" alt=""
            v-for="(img, key) in product.imagesUrl" :key="img">
        </div>

      </div>
      <div class="col-lg-6 d-md-flex flex-column justify-content-between">
        <div class="">
          <h1>{{ product.title }}</h1>
          <p class="fs-5">{{ product.description }}</p>
          <p>備註：{{ product.content }}</p>
        </div>
        <div>
          <div class="text-center">
            <p class="my-0" :class="product.origin_price !== product.price
              ? 'text-decoration-line-through fs-6'
              : 'fs-5'">
              <span v-if="product.origin_price !== product.price">原價</span>
              <span v-else>售價</span>
              {{ $filters.currency(product.origin_price) }}元
            </p>
            <div v-if="product.origin_price !== product.price">
              <p class="fs-5 text-danger fw-bold">現在只要{{ $filters.currency(product.price) }}元!!</p>
            </div>
          </div>
          <button class="btn btn-outline-danger w-100" @click="addCartToUser">加到購物車</button>
        </div>
      </div>
    </div>
  </div>
</template>

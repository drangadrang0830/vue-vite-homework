<script setup>
import { ref, computed } from 'vue'

import VueEasyLightbox from 'vue-easy-lightbox'
import 'vue-easy-lightbox/dist/external-css/vue-easy-lightbox.css'

// 接收來自父層 API 的資料
const props = defineProps({
  imgList: {
    type: Array,
    default: () => []
  },
  productTitle: {
    type: String,
    default: '產品圖片'
  }
})

const visibleRef = ref(false)
const indexRef = ref(0)

//開啟燈箱並定位到特定圖片
const showLightbox = (index) => {
  indexRef.value = index
  visibleRef.value = true
}

//隱藏燈箱
const onHide = () => {
  visibleRef.value = false
}

//資料格式預處理
const formattedImgs = computed(() => {
  return props.imgList.map((url, index) => ({
    src: url,
    alt: `${props.productTitle} - 圖片 ${index + 1}`
  }))
})
</script>

<template>
  <div class="product-gallery">
    <div class="main-image overflow-hidden" @click.prevent="showLightbox(0)">
      <img :src="props.imgList[0] || 'via.placeholder.com'" class="img-fluid object-fit-cover zoomable-img rounded-4"
        :alt="`${props.productTitle} - 預覽圖 1`" />
    </div>
    <vue-easy-lightbox :visible="visibleRef" :imgs="formattedImgs" :index="indexRef" @hide="onHide" />
  </div>
</template>

<style scoped>
.main-image img {
  cursor: pointer;
}

.zoomable-img {
  transition: transform 0.3s ease;
  object-fit: cover;
}

.main-image:hover .zoomable-img {
  transform: scale(1.1);
}
</style>

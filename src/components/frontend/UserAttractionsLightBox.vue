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

const showLightbox = (index) => {
  indexRef.value = index
  visibleRef.value = true
}

const onHide = () => {
  visibleRef.value = false
}

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
/* 這裡放您原本的 CSS */
.main-image img {
  cursor: pointer;
}

.zoomable-img {
  transition: transform 0.3s ease;
  /* 關鍵：加入平滑過渡動畫 */
  object-fit: cover;
  /* 確保圖片正確填充容器，不變形 */
}

.main-image:hover .zoomable-img {
  transform: scale(1.1);
}
</style>

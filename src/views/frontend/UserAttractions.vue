<script setup>
import { onMounted } from 'vue'
import UserAttractionsLightBox from '@/components/frontend/UserAttractionsLightBox.vue'
import useUserProductsStore from '@/stores/frontend/userProductsStore'

const userProductsStore = useUserProductsStore()

onMounted(async () => {
  await userProductsStore.getAllProducts()
})

//邊框顏色
const borderColor = (num) => {
  switch (num) {
    case '熱門景點': return 'danger'
    case '夜宿地點': return 'warning'
    case '美食饗宴': return 'success'
    default: return 'primary'
  }
}

</script>

<style scoped>
/* 地圖 */
.aspect-ratio-box {
  position: relative;
  width: 100%;
  padding-top: 90%;
}

.iframe-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.map-container :deep(iframe) {
  width: 100% !important;
  height: 100% !important;
}

.border-setting {
  border: 24px solid;
  border-style: double;
}

.title-position {
  bottom: 99%;
}

/* 文字排版 */
.preserve-newline {
  text-align: justify;
  text-justify: inter-character;
  white-space: pre-line;
}

/* 畫面置底連結 */
.fixed-box {
  position: fixed;
  bottom: 2%;
  right: 2%;
}

.fixed-img {
  background-image: url('@/assets/Article-mango-lion.png');
  width: 150px;
  height: 190px;
  background-size: contain;
  background-repeat: no-repeat;
}

.fixed-box:hover .fixed-img {
  background-image: url('@/assets/Article-mango-lion2.png');
}

.trianglePosition {
  position: relative;
}

.triangle-text {
  background: #fff;
}

.triangle {
  width: 0px;
  height: 0px;
  border-width: 12px;
  border-style: solid;
  border-color: #fff transparent transparent transparent;
  position: absolute;
  bottom: -19px;
  left: 50%;
  z-index: 3;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}

.triangleBorder {
  width: 0px;
  height: 0px;
  border-width: 12px;
  border-style: solid;
  border-color: rgb(102, 16, 242) transparent transparent transparent;
  position: absolute;
  bottom: -23px;
  left: 50%;
  z-index: 2;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
}

.fixed-box:hover .triangle-text {
  background: #ffffff;
  font-weight: bold;
}

.fixed-box:hover .triangleBorder {
  border-color: rgb(85, 14, 201) transparent transparent transparent;
}
</style>

<template>
  <div class="container">
    <div class="row row-cols-1 g-3 g-lg-5 my-4">
      <div class="col border-setting p-3 position-relative rounded-4 border-primary mb-3"
        v-for="item in userProductsStore.attractionData" :key="item.id" :class="`border-${borderColor(item.category)}`">
        <div class="title-position position-absolute start-50 translate-middle-x bg-body-secondary px-3 fs-2">
          {{ item.category }}</div>
        <div class="row">
          <div class="col-lg-4 align-self-center text-center">
            <UserAttractionsLightBox :imgList="item.imagesUrl" :productTitle="item.title" stretched-link />
          </div>
          <div class="col-lg-5 mt-3 my-md-0">
            <h4>{{ item.title }}</h4>
            <p class="preserve-newline justify-text">{{ item.content }}</p>
          </div>
          <div class="col-lg-3 map-container align-self-center">
            <div class="aspect-ratio-box">
              <div v-html="item.description" class="iframe-content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-box text-center d-none d-lg-block">
      <RouterLink class="nav-link link-body-emphasis mx-3 " to="/products">
        <div class="trianglePosition">
          <p class="triangle-text border border-primary border-3 text-center text-dark rounded-4 py-1 px-4 lh-sm">前往農特產區
          </p>
          <div class="triangle"></div>
          <div class="triangleBorder"></div>
        </div>
        <div class="fixed-img" />
      </RouterLink>
    </div>
  </div>
</template>

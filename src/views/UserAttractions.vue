<script setup>
import { onMounted } from 'vue'
import UserAttractionsLightBox from '../components/UserAttractionsLightBox.vue'
import useUserProductsStore from '../stores/userProductsStore'

const userProductsStore = useUserProductsStore()
onMounted(async () => {
  await userProductsStore.getAllProducts();
})

const borderColor = (num) => {
  switch (num) {
    case '夜宿地點': return 'primary';
    case '熱門景點': return 'success';
    case '歲時祭儀': return 'danger';
    default: return 'warning';
  }
}
</script>

<style scoped>
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

.preserve-newline {
  text-align: justify;
  text-justify: inter-character;
  white-space: pre-line;
}
</style>

<template>
  <div class="container">
    <div class="row row-cols-1 g-3 g-lg-5 my-4">
      <div class="col border-setting p-3 position-relative rounded-4 border-primary"
        v-for="item in userProductsStore.attractionData" :key="item.id" :class="`border-${borderColor(item.category)}`">
        <div class="title-position position-absolute start-50 translate-middle-x bg-body-secondary px-3 fs-2">
          {{ item.category }}</div>
        <div class="row">
          <div class="col-md-4 align-self-center">
            <UserAttractionsLightBox :imgList="item.imagesUrl" stretched-link />
          </div>
          <div class="col-md-5">
            <h4>{{ item.title }}</h4>
            <p class="preserve-newline justify-text">{{ item.content }}</p>
          </div>
          <div class="col-md-3 map-container align-self-center">
            <div class="aspect-ratio-box">
              <div v-html="item.description" class="iframe-content"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

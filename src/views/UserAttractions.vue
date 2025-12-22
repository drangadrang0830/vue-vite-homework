<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import UserAttractionsLightBox from '../components/UserAttractionsLightBox.vue'
import useStatusStore from '../stores/statusStore'

const statusStore = useStatusStore()
const attractionsImgs = ref([])

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH


onMounted(async () => {
  //取得全部商品資訊(篩選景點項目)
  const targets = ["美食饗宴", "夜宿地點", "熱門景點", "歲時祭儀"];
  const title = `景點讀取`
  const url = `${APIurl}api/${PATHurl}/products/all`
  statusStore.isLoading = true
  try {
    const response = await axios.get(url)
    const attractionsList = response.data.products
    attractionsImgs.value = attractionsList.filter(item =>
      targets.includes(item.category)
    );
    console.log(attractionsImgs.value)
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message
    statusStore.pushMessage({
      title: `${title}失敗`,
      style: 'danger',
      content: errorMsg,
    })
  } finally {
    statusStore.isLoading = false
  }
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
      <div class="col border-setting p-3 position-relative rounded-4 border-primary" v-for="item in attractionsImgs"
        :key="item.id" :class="`border-${borderColor(item.category)}`">
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

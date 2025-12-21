<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import HomeCarousel from '../components/HomeCarousel.vue'
import useUserHomeStore from '../stores/userHomeStore'
import useStatusStore from '../stores/statusStore'


const userHomeStore = useUserHomeStore()
const statusStore = useStatusStore()

const scrollY = ref(0)
const handleScroll = () => {
  scrollY.value = window.scrollY
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

// 創建時讀取首頁資訊
onMounted(() => {
  userHomeStore.getUserHomeData('首頁');
})

//路徑轉換
const getImgUrl = (path) => {
  return new URL(path, import.meta.url).href;
};
</script>

<style scoped>
.parallax-section {
  height: 500px;
  background-image: url('../assets/home-banner.jpg');
  background-attachment: fixed;
  background-size: cover;
  background-position: bottom;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: brightness(0.9);
}

[data-bs-theme="dark"] .invert {
  filter: invert(100%);
}

[data-bs-theme="dark"] .png-outline {
  filter: drop-shadow(0 0 10px white);
}

.text-aligned {
  text-align: justify;
  text-justify: inter-ideograph;
}

.home-wood {
  background-image: url('../assets/home-wood.jpg');
  background-size: cover;
}
</style>

<template>
  <div>
    <LoadingOverlay :active="statusStore.isLoading"></LoadingOverlay>
    <div class="position-relative">
      <div class="parallax-section"></div>
      <div class="position-absolute top-50 start-0 translate-middle-y w-100">
        <div class="row justify-content-center w-100">
          <div class="col-8 col-lg-4">
            <img src="../assets/home-bannerText.png" class="img-fluid" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row my-4 my-lg-5">
        <div class="col-12 col-md-5 offset-md-3 text-center invert">
          <img src="../assets/home-inhere.png" class="w-50" alt="">
        </div>
        <div class="col-12 col-md-5 offset-md-4 text-center invert">
          <img src="../assets/home-youCan.png" class="w-50" alt="">
        </div>
      </div>

      <div class="row justify-content-md-center align-items-center mb-4 my-lg-5"
        :class="{ 'flex-md-row-reverse': index % 2 !== 0 }" v-for="(item, index) in userHomeStore.userHomeData"
        :key="item.title">
        <div class="col-md-5 position-relative">
          <img :src="getImgUrl(item.imagesUrl[0])" :alt="item.title" class="img-fluid img-thumbnail mb-2">
          <img src="../assets/home-border.png"
            class="img-fluid position-absolute top-0 translate-middle w-25 z-1 d-none d-lg-block" alt=""
            :class="index % 2 === 0 ? 'start-0' : 'start-100'">
          <div class="position-absolute top-0 translate-middle w-25 z-3 text-center d-none d-lg-block"
            :class="index % 2 === 0 ? 'start-0' : 'start-100'">
            <router-link class="w-75" to="/">
              <img :src="getImgUrl(item.imagesUrl[1])" class="w-75" :alt="item.description">
            </router-link>
          </div>
        </div>

        <div class="col-12 col-md-6 text-center text-md-start">
          <h3 class="d-inline-block border-bottom border-primary border-3">{{ item.title }}</h3>
          <br class="d-none d-lg-block">
          <p class="fs-5 text-start" style="white-space: pre-line !important;">
            {{ item.content }}
          </p>
        </div>
      </div>

    </div>
    <div class="home-wood py-4">
      <div class="container">
        <div class="row justify-content-center my-5">
          <div class="col-12 col-lg-11">
            <h2 class="text-center mb-4 text-white fw-bold"><i class="bi bi-images"></i>活動剪影</h2>
            <HomeCarousel />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

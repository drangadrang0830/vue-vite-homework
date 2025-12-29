<script setup>
import { onMounted } from 'vue'
import useUserArticleStore from '../stores/userArticleStore'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const userArticleStore = useUserArticleStore()
const modules = [EffectCoverflow, Pagination, Navigation, Autoplay]

onMounted(() => {
  userArticleStore.getArticles()
})
</script>

<template>
  <div class="my-5 swiper-container-custom">
    <Swiper :effect="'coverflow'" :grabCursor="true" :centeredSlides="true" :loop="true" :autoplay="{
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    }" :coverflowEffect="{
      rotate: 20,
      stretch: -30,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }" :pagination="{ clickable: true }" :navigation="true" :modules="modules" :slidesPerView="1" :breakpoints="{
        768: {
          slidesPerView: 3,
        }
      }" class="mySwiper">
      <SwiperSlide v-for="article in userArticleStore.articles" :key="article.id">
        <img :src="article.image" :alt="article.title" class="object-fit-cover carousel-img"
          style="height: 450px; width: 100%;" />
        <div class="carousel-caption d-none d-md-block bg-body text-body bg-opacity-50 rounded">
          <h5 class="m-0 h4">{{ article.title }}</h5>
          <p class="m-0 h5">{{ article.description }}</p>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style scoped>
.swiper-container-custom {
  --swiper-navigation-color: #FFFFFF;
  --swiper-theme-color: #FFFFFF;
  /* 確保兩個變數都被設定 */
}

.carousel-caption {
  padding: 1rem;
  bottom: 2rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
}

.carousel-img {
  border-style: solid;
  border-width: 15px;
  border-image: url(../assets/home-carousel-border.png) 33.33% round;
  border-image-width: 1;
  background-clip: padding-box;
}
</style>

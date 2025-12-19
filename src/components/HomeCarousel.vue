<script setup>
import { ref } from 'vue'
// 匯入圖片資源
import activityI from '../assets/home-activityI.jpg'
import explore from '../assets/home-explore.jpg'
import firefly from '../assets/home-firefly.jpg'
import food from '../assets/home-food.jpg'

const carouselItems = ref([
  { id: 0, src: activityI, alt: '參與部落活動體驗', caption: '芒果節盛景' },
  { id: 1, src: explore, alt: '竹杖芒鞋輕勝馬', caption: '一步一腳印探索' },
  { id: 2, src: firefly, alt: '兒時情景再現', caption: '螢火蟲紛飛的夜晚' },
  { id: 3, src: food, alt: '深入了解當地文化', caption: '暢享傳統美食' }
])
</script>

<template>
  <!-- 使用 Bootstrap 5 的 Carousel 結構 -->
  <div id="homeCarousel" class="carousel slide carousel-fade my-5 border-body" data-bs-ride="carousel">
    <!-- 指示標籤 -->
    <div class="carousel-indicators">
      <button v-for="(item, index) in carouselItems" :key="'btn-' + item.id" type="button"
        data-bs-target="#homeCarousel" :data-bs-slide-to="index" :class="{ active: index === 0 }" aria-current="true">
      </button>
    </div>

    <!-- 輪播內容 -->
    <div class="carousel-inner shadow-lg">
      <div v-for="(item, index) in carouselItems" :key="item.id" class="carousel-item" :class="{ active: index === 0 }"
        data-bs-interval="3000">
        <img :src="item.src" class="d-block w-100 object-fit-cover" style="height: 450px;" :alt="item.alt">
        <div class="carousel-caption d-none d-md-block bg-body text-body bg-opacity-50 rounded">
          <h5>{{ item.alt }}</h5>
          <p>{{ item.caption }}</p>
        </div>
      </div>
    </div>

    <!-- 左右控制鍵 -->
    <button class="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<style scoped>
.carousel-item img {
  /* 確保圖片在高度固定時不會變形 */
  object-fit: cover;
}

.carousel-caption {
  padding: 1rem;
  bottom: 2rem;
}

.carousel {
  border-style: solid;
  border-width: 15px;
  /* border-color 建議設為透明或與背景同色，以避免 border-image 載入失敗時的視覺衝突 */
  /*   邊框的影像來源 */
  border-image: url(../assets/home-carousel-border.png) 33.33% round;

  border-image-width: 1;
  /*   邊框的影像寬度 */

  /* 防止背景顏色超出 border-image */
  background-clip: padding-box;
}
</style>

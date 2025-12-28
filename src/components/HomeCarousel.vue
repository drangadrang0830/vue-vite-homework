<script setup>
import { onMounted } from 'vue'
import useUserArticleStore from '../stores/userArticleStore'
// 匯入圖片資源
// import activityI from '../assets/home-activityI.jpg'
// import explore from '../assets/home-explore.jpg'
// import firefly from '../assets/home-firefly.jpg'
// import food from '../assets/home-food.jpg'

// const carouselItems = ref([
//   { id: 0, src: activityI, alt: '參與部落活動體驗', caption: '芒果節盛景' },
//   { id: 1, src: explore, alt: '竹杖芒鞋輕勝馬', caption: '一步一腳印探索' },
//   { id: 2, src: firefly, alt: '兒時情景再現', caption: '螢火蟲紛飛的夜晚' },
//   { id: 3, src: food, alt: '深入了解當地文化', caption: '暢享傳統美食' }
// ])

const userArticleStore = useUserArticleStore()

onMounted(() => {
  userArticleStore.getArticles()
})

</script>

<template>
  <!-- 使用 Bootstrap 5 的 Carousel 結構 -->
  <div id="homeCarousel" class="carousel slide carousel-fade my-5 border-body" data-bs-ride="carousel">
    <!-- 指示標籤 -->
    <div class="carousel-indicators">
      <button v-for="(article, index) in userArticleStore.articles" :key="'btn-' + article.id" type="button"
        data-bs-target="#homeCarousel" :data-bs-slide-to="index" :class="{ active: index === 0 }" aria-current="true">
      </button>
    </div>

    <!-- 輪播內容 -->
    <div class="carousel-inner shadow-lg">
      <div v-for="(article, index) in userArticleStore.articles" :key="article.id" class="carousel-item"
        :class="{ active: index === 0 }" data-bs-interval="3000">
        <img :src="article.image" class="d-block w-100 object-fit-cover" style="height: 450px;" :alt="article.title">
        <div class="carousel-caption d-none d-md-block bg-body text-body bg-opacity-50 rounded">
          <h5 class="m-0 h4">{{ article.title }}</h5>
          <p class="m-0 h5">{{ article.description }}</p>
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
  border-image: url(../assets/home-carousel-border.png) 33.33% round;
  border-image-width: 1;
  background-clip: padding-box;
}
</style>

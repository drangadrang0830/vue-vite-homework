<script setup>
import { onMounted } from 'vue'
import Swal from 'sweetalert2'
import useUserProductsStore from '@/stores/frontend/userProductsStore'
import useUserArticleStore from '@/stores/frontend/userArticleStore'
import HomeCarousel from '@/components/frontend/HomeCarousel.vue'
import BiteBtn from '@/components/shared/BiteBtn.vue'

const userProductsStore = useUserProductsStore()
const userArticleStore = useUserArticleStore()

onMounted(async () => {
  await userProductsStore.getAllProducts()
  await userArticleStore.getArticles()
})

//路徑轉換
const getImgUrl = (path) => {
  return new URL(path, import.meta.url).href
}

// 表單送出
const onSubmit = (values, { resetForm }) => {
  Swal.fire({
    title: '訂閱成功！',
    text: '感謝您訂閱獅子電子報，優惠劵代碼為「Shizi」。',
    icon: 'success',
    confirmButtonText: '確定',
    confirmButtonColor: '#198754'
  })
  resetForm()
}

</script>

<style scoped>
/* Banner */
.parallax-section {
  height: 500px;
  background-image: url('@/assets/home-banner.jpg');
  background-attachment: fixed;
  background-size: cover;
  background-position: bottom;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: brightness(0.9);
}

/* 視覺特效 */
[data-bs-theme="dark"] .invert {
  filter: invert(100%);
}

.text-aligned {
  text-align: justify;
  text-justify: inter-character;
}


.img-hover {
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}

.img-hover:hover {
  transform: scale(1.1) rotate(10deg);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  filter: brightness(1.1);
}

/* 自訂邊框 */
.sea-border {
  border-style: solid;
  border-width: 45px 0px 45px 0px;
  border-image: url(@/assets/home-sea-border.png) 28% 0% repeat;
}
</style>

<template>
  <div>
    <div class="position-relative">
      <h6 class="bg-warning-subtle p-1 m-0 text-center text-danger">目前訂閱電子報，即送9折優惠劵!</h6>
      <div class="parallax-section"></div>
      <div class="position-absolute top-50 start-0 translate-middle-y w-100">
        <div class="row justify-content-center w-100">
          <div class="col-11 col-lg-6 position-relative">
            <img src="@/assets/home-bannerText2.png" class="img-fluid" alt="帶著微醺，頂著驕陽，歡迎來到獅子鄉">
            <RouterLink
              class="btn btn-info position-absolute top-100 start-50 translate-middle-x border-light border-2 mt-2 text-nowrap"
              to="/products">
              瞧瞧有啥好料 <i class="bi bi-arrow-right"></i></RouterLink>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row my-4 my-lg-5">
        <div class="col-12 col-md-5 offset-md-3 text-center invert">
          <img src="@/assets/home-inhere.png" class="w-50" alt="在這裡">
        </div>
        <div class="col-12 col-md-5 offset-md-4 text-center invert">
          <img src="@/assets/home-youCan.png" class="w-50" alt="你可以">
        </div>
      </div>
      <div class="row justify-content-md-center align-items-center mb-4 my-lg-5"
        :class="{ 'flex-md-row-reverse': index % 2 !== 0 }" v-for="(item, index) in userProductsStore.homeData"
        :key="item.title">
        <div class="col-md-5 position-relative">
          <img :src="getImgUrl(item.imagesUrl[0])" :alt="item.title" class="img-fluid img-thumbnail mb-2 w-100">
          <img src="@/assets/home-border.png"
            class="img-fluid position-absolute top-0 translate-middle w-25 z-1 d-none d-lg-block invert bg-opacity-75"
            alt="" :class="index % 2 === 0 ? 'start-0' : 'start-100'">
          <div class="position-absolute top-0 translate-middle w-25 z-3 text-center d-none d-lg-block"
            :class="index % 2 === 0 ? 'start-0' : 'start-100'">
            <RouterLink class="w-75" :to="item.description">
              <img :src="getImgUrl(item.imagesUrl[1])" class="w-75 bg-info rounded-circle img-hover"
                :alt="`前往${item.title}相關頁面`">
            </RouterLink>
          </div>
        </div>
        <div class="col-md-6 text-center text-md-start">
          <h3 class="d-inline-block border-bottom border-primary border-3">{{ item.title }}</h3>
          <br class="d-none d-lg-block">
          <p class="fs-5 text-start text-aligned" style="white-space: pre-line !important;">
            {{ item.content }}
          </p>
        </div>
      </div>
    </div>
    <div class="p-4 bg-body sea-border">
      <div class="container ">
        <div class="row justify-content-center my-5">
          <div class="col-lg-11">
            <h2 class="text-center mb-4 text-body fw-bold"><i class="bi bi-images"></i>活動剪影</h2>
            <HomeCarousel v-if="userArticleStore.articles.length > 5" />
          </div>
          <div class="col-lg-7 bg-body rounded-4 border border-3 border-primary p-4 bg-opacity-75">
            <h2 class="text-center">訂閱獅子電子報</h2>
            <p class="text-muted mb-4 text-center">獲取最新鄉內消息、優惠活動與專屬好康</p>
            <v-form v-slot="{ errors }" @submit="onSubmit">
              <v-field id="newsletter-email" name="電子信箱" type="email" class="form-control"
                :class="{ 'is-invalid': errors['電子信箱'] }" placeholder="請輸入 Email" rules="email|required"
                ria-label="請輸入電子報信箱" aria-describedby="button-addon2" />
              <error-message name="電子信箱" class="invalid-feedback" />
              <div class="text-center py-3">
                <BiteBtn text="立即訂閱" size="lg" type="submit" id="button-addon2" />
              </div>
            </v-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

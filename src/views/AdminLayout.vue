<script setup>
import useStatusStore from '@/stores/statusStore'
import ToastMessages from '@/components/ToastMessages.vue'
import AdminSidebar from '@/components/AdminSidebar.vue'

const statusStore = useStatusStore()

</script>

<template>
  <div class="d-flex bg-body-secondary">
    <AdminSidebar />
    <div class="main-content-wrapper flex-grow-1 d-flex flex-column min-vh-100 pt-5 pt-lg-0">
      <main class="flex-grow-1 p-3">
        <router-view />
      </main>
      <div class="footer  bg-info-subtle">
        <div class="container py-4">
          <div class="row justify-content-center">
            <div class="col-12 col-lg-11  text-center">
              <h3 class="text-body">聯絡方式</h3>
              <div class="fs-4 mb-2">
                <router-link class="link-primary text-body p-3" to="/">
                  <i class="bi bi-facebook"></i>
                </router-link>
                <router-link class="link-primary text-body p-3" to="/">
                  <i class="bi bi-line"></i>
                </router-link>
                <router-link class="link-primary text-body p-3" to="/">
                  <i class="bi bi-instagram"></i>
                </router-link>
                <div class="vr mx-3 d-lg-inline-block d-none"></div>
                <hr class="d-lg-none mx-auto w-50">
                <a href="tel:+886987654321" class="link-primary text-body p-3">
                  <i class="bi bi-telephone-fill"></i>
                </a>
                <a href="mailto:boss0830@hotmail.com.tw" class="link-primary text-body p-3">
                  <i class="bi bi-envelope-at-fill"></i>
                </a>
                <a href="https://www.google.com/maps/place/%E5%B1%8F%E6%9D%B1%E7%B8%A3%E7%8D%85%E5%AD%90%E9%84%89%E5%85%AC%E6%89%80/@22.2020362,120.7053284,1624m/data=!3m1!1e3!4m15!1m8!3m7!1s0x3471cfba004463e5:0x465a35f24e819f2b!2zOTQz5bGP5p2x57ij542F5a2Q6YSJ!3b1!8m2!3d22.2471686!4d120.734995!16s%2Fm%2F02vxdn3!3m5!1s0x3471c5f0c53844a1:0x4e83d0f4a6db7df1!8m2!3d22.2018417!4d120.7054135!16s%2Fg%2F1thxszkr?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D"
                  class="link-primary text-body p-3" target="_blank">
                  <i class="bi bi-geo-alt-fill"></i>
                </a>
              </div>
            </div>
            <p class="mb-0 text-body text-center">本網站由范智聖設計 © 2025版權所有 <br>個人練習作品用，非商業使用</p>
          </div>
        </div>
      </div>
    </div>
    <ToastMessages />
    <LoadingOverlay :active="statusStore.isLoading" :z-index="1070" />
  </div>
</template>

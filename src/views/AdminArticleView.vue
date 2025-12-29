<script setup>
import { ref, onMounted } from 'vue'
import useAdminArticleStore from '@/stores/adminArticleStore'
import ArticleModal from '@/components/ArticleModal.vue'
import SharedPagination from '@/components/SharedPagination.vue'
import AdminDeleteModal from '@/components/AdminDeleteModal.vue'

const adminArticleStore = useAdminArticleStore()

const articleModal = ref(null)
const deleteModal = ref(null)

onMounted(() => {
  adminArticleStore.getArticles()
})

//Modal控制
const openNewArticleModal = () => {
  articleModal.value.openModal()
}

const openEditArticleModal = (id) => {
  articleModal.value.openModal(id)
}

//文章MODAL回應
const handleUpdateComplete = () => {
  adminArticleStore.getArticles()
}

//刪除按鈕事件
const openDeleteArticle = (article) => {
  deleteModal.value.openModal(article, async (target) => {
    const success = await adminArticleStore.deleteArticle(target)
    if (success) {
      adminArticleStore.getArticles()
    }
  })
}

//切換分頁
const handlePageChange = (page) => {
  adminArticleStore.getArticles(page)
}
</script>

<style scoped>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<template>
  <div>
    <div class="text-end m-3">
      <button class="btn btn-primary" type="button" @click="openNewArticleModal()">新增文章</button>
    </div>
    <div class="container-fluid d-lg-none p-0 my-4">
      <div class="row g-2" v-if="adminArticleStore.articles.length > 0">
        <div class="col-6" v-for="article in adminArticleStore.articles" :key="article.id">
          <div class="card h-100 shadow-sm border-0">
            <img :src="article.image" class="card-img-top object-fit-cover" height="150" alt="文章圖片">
            <div class="card-body p-2 d-flex flex-column">
              <h6 class="card-title text-truncate fw-bold mb-1" :title="article.title">{{ article.title }}</h6>
              <p class="small text-muted mb-1">
                {{ article.author }} | <span :class="article.isPublic ? 'text-success' : 'text-muted'">{{
                  article.isPublic ? '已公開' : '未公開' }}</span>
              </p>
              <p class="card-text text-truncate-2 text-break mb-2">
                {{ article.description }}
              </p>
              <div class="mt-auto d-grid gap-1">
                <button class="btn btn-sm btn-outline-primary py-1"
                  @click="openEditArticleModal(article.id)">編輯</button>
                <button class="btn btn-sm btn-outline-danger py-1" @click="openDeleteArticle(article)">刪除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <table class="table my-4 align-middle table-hover d-none d-lg-table">
      <thead>
        <tr class="text-center">
          <th>標題</th>
          <th style="width: 10%;" class="d-none d-md-table-cell">圖片</th>
          <th class="d-none d-md-table-cell">作者</th>
          <th style="width: 20%;">摘要</th>
          <th><span class="d-none d-md-inline">是否</span>公開<span class="d-inline d-md-none">?</span></th>
          <th class="d-none d-md-table-cell">關鍵字</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody v-if="adminArticleStore.articles.length > 0">
        <tr v-for="article in adminArticleStore.articles" :key="article.id">
          <td class="text-center">{{ article.title }}</td>
          <td class="text-center d-none d-md-table-cell"><img :src="article.image" alt="圖片連結無效" class="img-fluid"></td>
          <td class="text-center d-none d-md-table-cell">{{ article.author }}</td>
          <td class="text-break">{{ article.description }}</td>
          <td class="text-center">
            <span class="text-success" v-if="article.isPublic">已公開</span>
            <span class="text-muted" v-else>未公開</span>
          </td>
          <td class="text-center d-none d-md-table-cell">
            <span v-for="(tag, index) in article.tag" :key="index">
              {{ tag }}
              <span v-if="index < article.tag.length - 1">,</span>
            </span>
          </td>
          <td class="text-center">
            <div class="vstack gap-2">
              <button class="btn btn-outline-primary btn-sm" @click="openEditArticleModal(article.id)">編輯</button>
              <button type="button" class="btn btn-outline-danger btn-sm" @click="openDeleteArticle(article)">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="6" class="text-center py-5 text-muted">目前沒有文章資料</td>
        </tr>
      </tbody>
    </table>
    <SharedPagination v-if="adminArticleStore.pagination.total_pages > 1" :pages="adminArticleStore.pagination"
      @emit-pages="handlePageChange" />
    <ArticleModal ref="articleModal" @update-complete="handleUpdateComplete" />
    <AdminDeleteModal ref="deleteModal" />
  </div>
</template>

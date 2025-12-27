<script setup>
import { ref, onMounted } from 'vue'
import useAdminArticleStore from '../stores/AdminArticleStore'
import ArticleModal from '../components/ArticleModal.vue'
import SharedPagination from '../components/SharedPagination.vue'
import AdminDeleteModal from '../components/AdminDeleteModal.vue'


const AdminArticleStore = useAdminArticleStore()

const articleModal = ref(null);
const deleteModal = ref(null);

onMounted(() => {
  AdminArticleStore.getArticles();
})

//Modal控制
const openNewArticleModal = () => {
  articleModal.value.openModal();
}

const openEditArticleModal = (id) => {
  articleModal.value.openModal(id);
}


const handleUpdateComplete = () => {
  AdminArticleStore.getArticles();
}

const handlePageChange = (page) => {
  AdminArticleStore.getArticles(page);
};

const openDeleteArticle = (article) => {
  deleteModal.value.openModal(article, async (target) => {
    const success = await AdminArticleStore.deleteArticle(target);
    if (success) {
      AdminArticleStore.getArticles();
    }
  });
};


</script>

<template>
  <div>
    <div class="text-end m-3">
      <button class="btn btn-primary" type="button" @click="openNewArticleModal()">新增文章</button>
    </div>
    <table class="table mt-4 align-middle table-hover">
      <thead>
        <tr class="text-center">
          <th>標題</th>
          <th width="5%" class="d-none d-md-table-cell">圖片</th>
          <th class="d-none d-md-table-cell">作者</th>
          <th>摘要</th>
          <th><span class="d-none d-md-inline">是否</span>公開<span class="d-inline d-md-none">?</span></th>
          <th class="d-none d-md-table-cell">關鍵字</th>
          <th>編輯</th>
        </tr>
      </thead>

      <tbody v-if="AdminArticleStore.articles.length > 0">
        <tr v-for="article in AdminArticleStore.articles" :key="article.id">
          <td class="text-center">{{ article.title }}</td>
          <td class="text-center d-none d-md-table-cell"><img :src="article.image" alt="圖片連結無效" class="img-fluid"></td>
          <td class="text-center d-none d-md-table-cell">{{ article.author }}</td>
          <td>{{ article.description }}</td>
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
              <!--  -->
              <button class="btn btn-outline-primary btn-sm"
                @click="openEditArticleModal('-OhO8u9R6hviKl6zPOKW')">編輯</button>
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
    <SharedPagination v-if="AdminArticleStore.pagination.total_pages > 1" :pages="AdminArticleStore.pagination"
      @emit-pages="handlePageChange" />
    <ArticleModal ref="articleModal" @update-complete="handleUpdateComplete" />
    <AdminDeleteModal ref="deleteModal" />
  </div>
</template>

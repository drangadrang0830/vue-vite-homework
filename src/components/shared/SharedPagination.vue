<script setup>
const props = defineProps({
  pages: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['emit-pages'])

const changePage = (page) => {
  emit('emit-pages', page)
}
</script>

<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <!-- 上一頁按鈕 -->
      <li class="page-item" :class="{ 'disabled': !pages.has_pre }">
        <a class="page-link" href="#" aria-label="Previous" @click.prevent="changePage(props.pages.current_page - 1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <!-- 頁碼按鈕列表 -->
      <li class="page-item" v-for="page in pages.total_pages" :key="page"
        :class="{ 'active': page === pages.current_page }">
        <a class="page-link" href="#" @click.prevent="changePage(page)">
          {{ page }}
        </a>
      </li>

      <!-- 下一頁按鈕 -->
      <li class="page-item" :class="{ 'disabled': !pages.has_next }">
        <a class="page-link" href="#" aria-label="Next" @click.prevent="changePage(pages.current_page + 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

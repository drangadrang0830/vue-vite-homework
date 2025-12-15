<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: !userProducts.pagination.has_pre }">
        <a class="page-link" href="#" aria-label="Previous"
          @click.prevent="userProducts.getProducts(userProducts.pagination.current_page - 1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item" v-for="page in userProducts.pagination.total_pages" :key="page">
        <a class="page-link" href="#" @click.prevent="userProducts.getProducts(page)" :class="{
          'active': page === userProducts.pagination.current_page
        }">{{ page }}</a>
      </li>
      <li class="page-item" :class="{ disabled: !userProducts.pagination.has_next }">
        <a class="page-link" href="#" aria-label="Next"
          @click.prevent="userProducts.getProducts(userProducts.pagination.current_page + 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import useUserProducts from '../stores/userProducts'

const userProducts = useUserProducts()

</script>

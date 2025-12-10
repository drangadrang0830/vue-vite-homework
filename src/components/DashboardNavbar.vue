<script setup>
import store from '../stores/apiStore'

const apiStore = store()
</script>

<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">返回首頁</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboardview/productsview">產品列表</router-link>
            </li>

            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                待開發
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">待開發1</a></li>
                <li><a class="dropdown-item" href="#">待開發2</a></li>
                <li><a class="dropdown-item" href="#">待開發3</a></li>
              </ul>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="apiStore.logout">登出</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

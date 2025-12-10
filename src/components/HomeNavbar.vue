<template>
  <div>
    <nav class="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">首頁</router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link" to="/dashboardview" disabled>前台</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/loginview">後台</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

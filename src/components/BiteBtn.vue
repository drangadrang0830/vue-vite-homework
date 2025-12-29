<script setup>
defineProps({
  text: {
    type: String,
    default: 'Click Me'
  },
  size: {
    type: String,
    default: 'md' // md, lg
  }
});
</script>

<template>
  <button :class="['btn-bite', `btn-${size}`, 'mt-3']">
    <span v-for="n in 4" :key="'top-' + n" class="triangle top-row" :style="{ '--n': n }"></span>
    <span v-for="n in 5" :key="'bot-' + n" class="triangle bot-row" :style="{ '--n': n }"></span>
    <span class="btn-text">{{ text }}</span>
  </button>
</template>

<style scoped>
/* 核心樣式仍需保留在 scoped style 內 */
.btn-bite {
  --color-dark: #000000;
  --color-accent: #dc3545;
  /* BS color 'danger' */

  position: relative;
  z-index: 1;
  background: transparent;
  border: 2px solid var(--color-dark);
  border-radius: 0px;
  color: var(--color-dark);
  overflow: hidden;
  cursor: pointer;
  transition: color 0.4s ease, border-color 0.4s ease;
  letter-spacing: 2px;
  outline: none;
  /* 移除點擊藍色外框 */
}

/* 大小變化：中等 (md) */
.btn-md {
  padding: 10px 30px;
  font-size: 1rem;
}

/* 大小變化：大型 (lg) */
.btn-lg {
  padding: 15px 40px;
  font-size: 1.2rem;
  min-width: 220px;
}

.btn-text {
  position: relative;
  z-index: 2;
}

.triangle {
  position: absolute;
  width: 25%;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.7, 0, 0.3, 1);
  z-index: 1;
}

.top-row {
  top: 0;
  left: calc((var(--n) - 1) * 25%);
  clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
  transform: translateY(-100%);
  background-color: var(--color-dark);
}

.bot-row {
  bottom: 0;
  left: calc((var(--n) - 1) * 25% - 12.5%);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: translateY(100%);
  background-color: var(--color-accent);
  opacity: 0.9;
}

/* --- Hover 觸發狀態 --- */
.btn-bite:hover {
  color: #ffffff;
  border-color: var(--color-accent);
}

.btn-bite:hover .triangle {
  transform: translateY(0);
}

.triangle {
  transition-delay: calc(var(--n) * 0.04s);
}
</style>

<!-- 父層
<script setup>
import InterlockButton from './components/InterlockButton.vue'; // 引入組件
</script>

<template>
  <div class="app-container">
    <h1>使用組件化按鈕</h1>

    <InterlockButton text="標準按鈕" size="md" />

    <InterlockButton text="INTERLOCK 2" size="lg" />

    <InterlockButton text="提交表單" size="md" />
  </div>
</template>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  gap: 30px;
  background-color: #f8f9fa;
  font-family: sans-serif;
}
</style> -->

<script setup>
defineProps({
  text: { type: String, default: 'Click Me' },
  size: { type: String, default: 'md' }
})
</script>

<style scoped>
.btn-bite {
  /* 基礎變數 */
  --btn-bg-tri-top: #000000;
  /* 三角形(上) 固定黑色 */
  --btn-bg-tri-bot: #dc3545;
  /* 三角形(下) 固定紅色 */
  --border-color: #000000;
  /* 預設邊框黑色 */
  --text-color: #000000;
  /* 預設文字黑色 */

  position: relative;
  z-index: 1;
  background: transparent;
  border: 2px solid var(--border-color);
  border-radius: 0px;
  color: var(--text-color);
  overflow: hidden;
  cursor: pointer;
  transition: color 0.4s ease, border-color 0.4s ease;
  letter-spacing: 2px;
  outline: none;
}

/* 深色模式：僅切換邊框與初始文字顏色，不影響三角形變數 */
[data-bs-theme="dark"] .btn-bite {
  --border-color: #ffffff;
  --text-color: #ffffff;
}

.btn-md {
  padding: 10px 30px;
  font-size: 1rem;
}

.btn-lg {
  padding: 15px 40px;
  font-size: 1.2rem;
  min-width: 220px;
}

.btn-text {
  position: relative;
  z-index: 2;
  transition: color 0.4s ease;
  color: inherit;
  /* 繼承自 .btn-bite */
  pointer-events: none;
}

.btn-bite:hover {
  color: #ffffff;
  /* 只要 hover，文字一律變白以契合深色三角形背景 */
  border-color: #dc3545;
  /* hover 時邊框轉紅 */
}

.triangle {
  position: absolute;
  width: 25%;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.7, 0, 0.3, 1);
  transition-delay: calc(var(--n) * 0.04s);
  z-index: 1;
}

.btn-bite:hover .triangle {
  transform: translateY(0);
}

.top-row {
  top: 0;
  left: calc((var(--n) - 1) * 25%);
  clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
  transform: translateY(-100%);
  /* 使用固定的三角形變數 */
  background-color: var(--btn-bg-tri-top);
}

.bot-row {
  bottom: 0;
  left: calc((var(--n) - 1) * 25% - 12.5%);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: translateY(100%);
  /* 使用固定的三角形變數 */
  background-color: var(--btn-bg-tri-bot);
  opacity: 0.9;
}
</style>

<template>
  <button :class="['btn-bite', `btn-${size}`, 'mt-3']" type="button">
    <!-- 保持原樣 -->
    <span v-for="n in 4" :key="'top-' + n" class="triangle top-row" :style="{ '--n': n }"></span>
    <span v-for="n in 5" :key="'bot-' + n" class="triangle bot-row" :style="{ '--n': n }"></span>
    <span class="btn-text">{{ text }}</span>
  </button>
</template>

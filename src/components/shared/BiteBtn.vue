<script setup>
defineProps({
  text: {
    type: String,
    default: 'Click Me'
  },
  size: {
    type: String,
    default: 'md'
  }
})
</script>

<style scoped>
.btn-bite {
  --color-dark: #000000;
  --color-accent: #dc3545;

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
  transition: color 0.6s;
  color: #000000;
}

[data-bs-theme="dark"] .btn-text {
  color: #ffffff;
}

.btn-text:hover {
  color: #ffffff;
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

<template>
  <button :class="['btn-bite', `btn-${size}`, 'mt-3']" type="button">
    <span v-for="n in 4" :key="'top-' + n" class="triangle top-row" :style="{ '--n': n }"></span>
    <span v-for="n in 5" :key="'bot-' + n" class="triangle bot-row" :style="{ '--n': n }"></span>
    <span class="btn-text">{{ text }}</span>
  </button>
</template>

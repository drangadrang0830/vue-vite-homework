import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('userFavoriteStore', () => {
  const favorites = ref(JSON.parse(localStorage.getItem('userFavorites')) || [])

  //紀錄收藏
  const toggleFavorite = (product) => {
    const index = favorites.value.findIndex((item) => item.id === product.id)
    if (index === -1) {
      favorites.value.push(product)
    } else {
      favorites.value.splice(index, 1)
    }
    localStorage.setItem('userFavorites', JSON.stringify(favorites.value))
  }

  //查驗是否已存在收藏
  const isFavorite = computed(() => {
    return (productId) => favorites.value.some((item) => item.id === productId)
  })

  return {
    favorites,
    toggleFavorite,
    isFavorite
  }
})

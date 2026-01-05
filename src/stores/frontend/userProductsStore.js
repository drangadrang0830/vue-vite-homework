import { ref, computed } from 'vue'
import { userProducts } from '@/api'
import { defineStore } from 'pinia'
import useStatusStore from '@/stores/statusStore'

export default defineStore('userProductsStore', () => {
  const allProducts = ref([])
  const homeData = ref([])
  const attractionData = ref([])
  const farmProducts = ref([])
  const categories = ref([])
  const product = ref({})
  let isFetching = false

  //取得所有商品資訊
  const getAllProducts = async () => {
    if (allProducts.value.length > 0 || isFetching) return
    isFetching = true
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    try {
      const response = await userProducts.getAll()
      const data = response.data.products || []
      allProducts.value = data

      homeData.value = data.filter((item) => item.category === '首頁')

      const attractionTargets = ['美食饗宴', '夜宿地點', '熱門景點', '歲時祭儀']
      attractionData.value = data.filter((item) => attractionTargets.includes(item.category))

      farmProducts.value = data.filter((item) => item.category?.includes('農特產品'))
      updateFarmCategories()
    } catch (error) {
      statusStore.handleMessage(error, '讀取商品')
    } finally {
      statusStore.isLoading = false
      isFetching = false
    }
  }

  //特價商品
  const specialOfferProducts = computed(() => {
    return farmProducts.value.filter((product) => {
      return Number(product.origin_price) !== Number(product.price)
    })
  })

  //農特產品標籤預處理
  const updateFarmCategories = () => {
    const categoryCounts = farmProducts.value.reduce((acc, item) => {
      const name = item.category
      if (name) acc[name] = (acc[name] || 0) + 1
      return acc
    }, {})

    categories.value = [
      { name: '全部商品', count: farmProducts.value.length },
      ...Object.keys(categoryCounts).map((name) => ({ name, count: categoryCounts[name] }))
    ]
  }

  //取得單一產品說明
  const descriptionProduct = async (id) => {
    product.value = {}
    const statusStore = useStatusStore()
    statusStore.isLoading = true
    try {
      const response = await userProducts.getSingle(id)
      if (response.data.success) {
        product.value = response.data.product
      }
    } catch (error) {
      statusStore.handleMessage(error, '讀取商品')
    } finally {
      statusStore.isLoading = false
    }
  }

  return {
    getAllProducts,
    homeData,
    attractionData,
    farmProducts,
    categories,
    descriptionProduct,
    product,
    specialOfferProducts
  }
})

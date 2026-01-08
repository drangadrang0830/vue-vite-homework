<script setup>
import { ref } from 'vue'
import { useModal } from '@/composables/useModal'
import useAdminProductsStore from '@/stores/backend/adminProductsStore'

const adminProductsStore = useAdminProductsStore()
const { modalElement, openModal, closeModal } = useModal()

const filesInput = ref(null)
const isUpload = ref(false)
const MAX_IMAGES = 5

//初始資料
const initialProduct = {
  title: '',
  category: '',
  unit: '',
  origin_price: 0,
  price: 0,
  description: '',
  content: '',
  is_enabled: 0,
  imagesUrl: [],
}

//暫存資料
const tempProduct = ref({ ...initialProduct })

//顯示與資料初始化
const show = (item = {}) => {
  tempProduct.value = JSON.parse(JSON.stringify({ ...initialProduct, ...item }))
  if (!Array.isArray(tempProduct.value.imagesUrl)) {
    tempProduct.value.imagesUrl = []
  }
  openModal()
}

//表單傳送區-------
const emit = defineEmits(['update-complete'])

const submitProduct = async () => {
  const success = await adminProductsStore.updateProduct(tempProduct.value)
  if (success) {
    emit('update-complete')
    closeModal()
  }
}
//---------------
//多張上傳圖片
const uploadFiles = async (event) => {
  const uploadedFiles = event.target.files
  if (!uploadedFiles.length) return

  const currentTotal = tempProduct.value.imagesUrl.length
  if (currentTotal + uploadedFiles.length > MAX_IMAGES) {
    alert(`圖片總數不能超過 ${MAX_IMAGES} 張。您已上傳 ${currentTotal} 張。`)
    filesInput.value.value = ''
    return
  }

  isUpload.value = true
  const uploadPromises = Array.from(uploadedFiles).map(file => {
    const formData = new FormData()
    formData.append('file-to-upload', file)
    return adminProductsStore.uploadFile(formData)
  })

  try {
    const imageUrls = await Promise.all(uploadPromises)
    imageUrls.forEach(url => {
      if (url) tempProduct.value.imagesUrl.push(url)
    })
  } finally {
    isUpload.value = false
    if (filesInput.value) filesInput.value.value = ''
  }
}
// -----------------

defineExpose({
  openModal: show,
  submitProduct
})
</script>

<template>
  <div>
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
      ref="modalElement">
      <div class="modal-dialog modal-fullscreen-md-down modal-xl" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>{{ tempProduct.id ? '編輯商品' : '新增商品' }}</span>
            </h5>
            <button type="button" class="btn-close" data-bs-theme="dark" data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-lg-3 mb-4">
                <div class="mb-3">
                  <label for="customFiles" class="btn btn-outline-secondary w-100 mb-0"
                    :class="{ 'disabled': isUpload }">
                    <span v-if="isUpload" class="spinner-border spinner-border-sm me-1" role="status"></span>
                    {{ isUpload ? '上傳中...' : '選擇圖片檔案上傳' }}
                  </label>
                  <input type="file" id="customFiles" class="form-control d-none" multiple
                    accept="image/jpeg, image/png" @change="uploadFiles" ref="filesInput" :disabled="isUpload">
                </div>
                <div class="row">
                  <template v-for="(imgUrl, key) in tempProduct.imagesUrl" :key="key">
                    <div :class="{ 'col-12': key === 0, 'col-6': key > 0 }" class="mb-3">
                      <div class="card h-100">
                        <img :src="imgUrl" class="card-img-top object-fit-cover"
                          :alt="`${tempProduct.title} 圖 ${key + 1}`" :style="{ height: key === 0 ? '180px' : '90px' }">
                        <div class="list-group list-group-flush mt-auto">
                          <button type="button"
                            class="list-group-item list-group-item-action btn btn-outline-danger text-center py-2"
                            @click="tempProduct.imagesUrl.splice(key, 1)">
                            移除
                          </button>
                        </div>
                      </div>
                    </div>
                  </template>
                  <div class="col-12 mb-3">
                    <p class="text-muted text-center">
                      僅支援 JPG、PNG 格式 <br>
                      總計限制 3MB 以內<br>
                      目前已上傳 {{ tempProduct.imagesUrl.length }} / {{ MAX_IMAGES }} 張圖片
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-lg-9">
                <div class="mb-3">
                  <label for="title" class="form-label">標題<span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="title" placeholder="請輸入標題 " v-model="tempProduct.title">
                </div>
                <div class="row gx-2">
                  <div class="mb-3 col-6">
                    <label for="category" class="form-label">分類<span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="category" placeholder="請輸入分類"
                      v-model="tempProduct.category">
                  </div>
                  <div class="mb-3 col-6">
                    <label for="price" class="form-label">單位<span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="unit" placeholder="請輸入單位" v-model="tempProduct.unit">
                  </div>
                </div>
                <div class="row gx-2">
                  <div class="mb-3 col-6">
                    <label for="origin_price" class="form-label">原價<span class="text-danger">*</span></label>
                    <input type="number" class="form-control" id="origin_price" placeholder="請輸入原價"
                      v-model="tempProduct.origin_price">
                  </div>
                  <div class="mb-3 col-6">
                    <label for="price" class="form-label">售價<span class="text-danger">*</span></label>
                    <input type="number" class="form-control" id="price" placeholder="請輸入售價"
                      v-model="tempProduct.price">
                  </div>
                </div>
                <hr>
                <div class="mb-3">
                  <label for="description" class="form-label">產品描述</label>
                  <textarea type="text" class="form-control" id="description" placeholder="請輸入產品描述" rows="2"
                    v-model="tempProduct.description"></textarea>
                </div>
                <div class="mb-3">
                  <label for="content" class="form-label">說明內容</label>
                  <textarea type="text" class="form-control" id="content" placeholder="請輸入產品說明內容" rows="4"
                    v-model="tempProduct.content"></textarea>
                </div>
                <div class="mb-3">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" rows="7" :true-value="1" :false-value="0"
                      id="is_enabled" v-model="tempProduct.is_enabled">
                    <label class="form-check-label" for="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click="submitProduct">確認</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

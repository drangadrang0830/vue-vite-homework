<script setup>
import { ref } from 'vue'
import { useModal } from '@/composables/useModal'
import useAdminArticleStore from '@/stores/backend/adminArticleStore'
import useAdminProductsStore from '@/stores/backend/adminProductsStore'

const adminArticleStore = useAdminArticleStore()
const adminProductsStore = useAdminProductsStore()

const { modalElement, openModal, closeModal } = useModal()

const fileInput = ref(null)
const isUploading = ref(false)
const newTag = ref('')

//初始資料
const initialArticle = {
  author: '',
  content: '',
  description: '',
  image: '',
  isPublic: false,
  tag: [],
  title: '',
  create_at: 0,
  id: ''
}

const tempArticle = ref({ ...initialArticle })

const show = async (id) => {
  if (id) {
    await adminArticleStore.getArticle(id)
    tempArticle.value = JSON.parse(JSON.stringify(adminArticleStore.article))
  } else {
    tempArticle.value = JSON.parse(JSON.stringify(initialArticle))
  }
  openModal()
}

// 標籤處理
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !tempArticle.value.tag.includes(tag)) {
    tempArticle.value.tag.push(tag)
    newTag.value = ''
  }
}
const removeTag = (index) => {
  tempArticle.value.tag.splice(index, 1)
}

//上傳圖片
const handleFileChange = (e) => uploadImage(e.target.files)
const handleDrop = (e) => uploadImage(e.dataTransfer.files)

const uploadImage = async (files) => {
  const file = files[0]
  if (!file) return

  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    alert('僅支援 JPG 或 PNG 格式')
    return
  }

  isUploading.value = true
  const formData = new FormData()
  formData.append('file-to-upload', file)

  try {
    const imageUrl = await adminProductsStore.uploadFile(formData)
    if (imageUrl) {
      tempArticle.value.image = imageUrl
    }
  } finally {
    isUploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

//表單送出區-------
const emit = defineEmits(['update-complete'])
const submitArticle = async () => {
  const success = await adminArticleStore.updateArticle(tempArticle.value)
  if (success) {
    emit('update-complete')
    closeModal()
  }
}
//----------------

defineExpose({
  openModal: show,
})
</script>

<template>
  <div class="modal fade" id="articleModal" tabindex="-1" role="dialog" ref="modalElement">
    <div class="modal-dialog modal-fullscreen-md-down modal-lg" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title">
            <span>{{ tempArticle.id ? '編輯文章' : '新增文章' }}</span>
          </h5>
          <button type="button" class="btn-close" data-bs-theme="dark" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <label for="imageUrl" class="form-label">圖片網址</label>
              <div class="upload-area border border-2 border-dashed rounded p-4 text-center mb-2" @dragover.prevent
                @drop.prevent="handleDrop" @click="fileInput.click()"
                style="cursor: pointer; background-color: #f8f9fa; border-style: dashed !important;">
                <div v-if="!isUploading">
                  <i class="bi bi-image fs-2 text-secondary"></i>
                  <p class="small mb-0 text-muted">點擊或拖曳圖片上傳</p>
                </div>
                <div v-else class="spinner-border spinner-border-sm text-primary" role="status"></div>
                <input type="file" class="d-none" ref="fileInput" @change="handleFileChange" accept="image/*">
              </div>
              <div class="mb-3">
                <input type="text" class="form-control form-control-sm mb-2" id="imageUrl" v-model="tempArticle.image"
                  placeholder="圖片網址">
                <div v-if="tempArticle.image" class="position-relative border rounded overflow-hidden">
                  <img :src="tempArticle.image" class="img-fluid" :alt="tempArticle.title">
                  <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                    @click="tempArticle.image = ''">
                    移除
                  </button>
                </div>
              </div>
              <div class="mb-3">
                <label for="tagInput" class="form-label">標籤 (Tags)</label>
                <div class="input-group mb-2">
                  <input type="text" id="tagInput" class="form-control" v-model="newTag" placeholder="新增標籤"
                    @keyup.enter="addTag">
                  <button class="btn btn-outline-secondary" type="button" @click="addTag">新增</button>
                </div>
                <div class="d-flex flex-wrap gap-1">
                  <span v-for="(tag, index) in tempArticle.tag" :key="index"
                    class="badge bg-primary d-flex align-items-center">
                    {{ tag }}
                    <button type="button" class="btn-close btn-close-white ms-2" style="font-size: 0.5rem"
                      @click="removeTag(index)"></button>
                  </span>
                </div>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題<span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="title" v-model="tempArticle.title" placeholder="請輸入標題">
              </div>
              <div class="mb-3">
                <label for="author" class="form-label">作者<span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="author" v-model="tempArticle.author" placeholder="請輸入作者">
              </div>
              <hr>
              <div class="mb-3">
                <label for="description" class="form-label">文章摘要</label>
                <textarea class="form-control" id="description" v-model="tempArticle.description" rows="3"
                  placeholder="請輸入文章摘要"></textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">文章內容<span class="text-danger">*</span></label>
                <textarea class="form-control" id="content" v-model="tempArticle.content" rows="5"
                  placeholder="請輸入文章詳細內容"></textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" v-model="tempArticle.isPublic" id="isPublic">
                  <label class="form-check-label" for="isPublic">是否公開</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="submitArticle">確認儲存</button>
        </div>
      </div>
    </div>
  </div>
</template>

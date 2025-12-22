<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Modal from 'bootstrap/js/dist/modal'
import useProductsStore from '../stores/productsStore'

//DOM元素
const modal = ref(null)
//操作實體
const bsModal = ref(null)
// 用於多圖上傳 input 的 ref
const filesInput = ref(null);

//modal控制區
onMounted(() => {
  if (modal.value) {
    bsModal.value = new Modal(modal.value);
  }
});

const openModal = (item = {}) => {
  // 淺拷貝傳入的產品資料
  tempProduct.value = { ...item };

  if (!tempProduct.value.imagesUrl) {
    tempProduct.value.imagesUrl = [];
  }

  bsModal.value.show();
}

onUnmounted(() => {
  if (modal.value && bsModal.value) {
    bsModal.value.dispose();
  }
});

// -----------------
const productsStore = useProductsStore();

const emit = defineEmits(['update-complete'])

const tempProduct = ref({
  imagesUrl: [],
});

// 呼叫通知父層關閉modal
const submitProduct = async () => {
  const success = await productsStore.updateProduct(tempProduct.value);
  if (success) {
    emit('update-complete');
    bsModal.value.hide();
  }
};

// -----------------

// 添加一個計算屬性或方法來檢查是否達到上限
const MAX_IMAGES = 5;

// 添加新的方法來處理多張圖片上傳
const uploadFiles = async (event) => {
  const uploadedFiles = event.target.files;
  if (uploadedFiles.length === 0) return;

  // 檢查當前加上新上傳的圖片總數是否超過限制
  const currentTotal = tempProduct.value.imagesUrl.length;
  const potentialTotal = currentTotal + uploadedFiles.length;

  if (potentialTotal > MAX_IMAGES) {
    alert(`圖片總數不能超過 ${MAX_IMAGES} 張。您已上傳 ${currentTotal} 張。`);
    filesInput.value.value = ''; // 清空 input file
    return;
  }

  const uploadPromises = Array.from(uploadedFiles).map(file => {
    // ... (原有的 formData 建立和 store 呼叫)
    const formData = new FormData();
    formData.append('file-to-upload', file);
    return productsStore.uploadFile(formData);
  });

  try {
    const imageUrls = await Promise.all(uploadPromises);
    imageUrls.forEach(url => {
      if (url) {
        tempProduct.value.imagesUrl.push(url);
      }
    });
    filesInput.value.value = '';

  } catch (error) {
    console.error("上傳失敗:", error);
    filesInput.value.value = '';
  }
};

// -----------------

defineExpose({
  openModal,
  submitProduct
})
</script>

<template>
  <div>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
      ref="modal">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>新增產品</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-3">
                <!-- 移除原有的 "上傳產品圖片 (最多 5 張)" 標題 -->

                <div class="mb-3">
                  <!-- 只有上傳按鈕，沒有網址輸入框 -->
                  <label for="customFiles" class="btn btn-outline-secondary w-100 mb-0">
                    選擇圖片檔案上傳
                  </label>
                  <!-- 隱藏實際的檔案選擇 input，並支援多選 -->
                  <input type="file" id="customFiles" class="form-control d-none" multiple
                    accept="image/jpeg, image/png" @change="uploadFiles" ref="filesInput">
                </div>

                <!-- 顯示圖片區域 -->
                <div class="row">
                  <!-- 使用 v-for 迴圈來顯示 imagesUrl 陣列中的所有圖片 -->
                  <template v-for="(imgUrl, key) in tempProduct.imagesUrl" :key="key">
                    <div :class="{ 'col-12': key === 0, 'col-6': key > 0 }" class="mb-3">
                      <!-- 使用 card 類別 -->
                      <div class="card h-100">
                        <!-- 圖片使用 card-img-top，並強制統一高度與 object-fit -->
                        <img :src="imgUrl" class="card-img-top" :alt="'產品圖片 ' + (key + 1)"
                          :style="{ height: key === 0 ? '180px' : '90px' }">
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

                  <!-- 提示目前張數，並加上格式與大小限制 -->
                  <div class="col-12 mb-3">
                    <p class="text-muted text-center">
                      僅支援 JPG、PNG 格式 <br>
                      總計限制 3MB 以內<br>
                      目前已上傳 {{ tempProduct.imagesUrl.length }} / {{ MAX_IMAGES }} 張圖片
                    </p>
                  </div>
                </div>
              </div>

              <!-- 右側欄位：產品資訊 (保留不變) -->
              <div class="col-sm-9">
                <div class="mb-3">
                  <label for="title" class="form-label">標題</label>
                  <input type="text" class="form-control" id="title" placeholder="請輸入標題 " v-model="tempProduct.title">
                </div>

                <div class="row gx-2">
                  <div class="mb-3 col-md-6">
                    <label for="category" class="form-label">分類</label>
                    <input type="text" class="form-control" id="category" placeholder="請輸入分類"
                      v-model="tempProduct.category">
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="price" class="form-label">單位</label>
                    <input type="text" class="form-control" id="unit" placeholder="請輸入單位" v-model="tempProduct.unit">
                  </div>
                </div>

                <div class="row gx-2">
                  <div class="mb-3 col-md-6">
                    <label for="origin_price" class="form-label">原價</label>
                    <input type="number" class="form-control" id="origin_price" placeholder="請輸入原價"
                      v-model="tempProduct.origin_price">
                  </div>
                  <div class="mb-3 col-md-6">
                    <label for="price" class="form-label">售價</label>
                    <input type="number" class="form-control" id="price" placeholder="請輸入售價"
                      v-model="tempProduct.price">
                  </div>
                </div>
                <hr>

                <div class="mb-3">
                  <label for="description" class="form-label">產品描述</label>
                  <textarea type="text" class="form-control" id="description" placeholder="請輸入產品描述"
                    v-model="tempProduct.description"></textarea>
                </div>
                <div class="mb-3">
                  <label for="content" class="form-label">說明內容</label>
                  <textarea type="text" class="form-control" id="content" placeholder="請輸入產品說明內容"
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
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">取消
            </button>
            <button type="button" class="btn btn-primary" @click="submitProduct">確認</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

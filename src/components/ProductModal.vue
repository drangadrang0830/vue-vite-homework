<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Modal from 'bootstrap/js/dist/modal'
import store from '../stores/productsStore'

//DOM元素
const modal = ref(null)
//操作實體
const bsModal = ref(null)
// 用於多圖上傳 input 的 ref
const filesInput = ref(null);

//modal控制區
onMounted(() => {
  if (modal.value) {
    bsModal.value = new Modal(modal.value)
    modal.value.addEventListener('hide.bs.modal', handleModalHide);
  }
})


// 覆寫 openModal 方法，確保編輯舊資料時 imagesUrl 陣列存在
const openModal = (item = {}) => {
  // 淺拷貝傳入的產品資料
  tempProduct.value = { ...item };

  // 確保 tempProduct 中有 imagesUrl 陣列，避免 v-for 錯誤
  if (!tempProduct.value.imagesUrl) {
    tempProduct.value.imagesUrl = [];
  }

  bsModal.value.toggle();
}

const handleModalHide = () => {
  document.activeElement.blur();
};

onUnmounted(() => {
  if (modal.value) {
    modal.value.removeEventListener('hide.bs.modal', handleModalHide);
  }
});

// -----------------
const productsStore = store();

const emit = defineEmits(['update-complete'])

const tempProduct = ref({
  imagesUrl: [],
});

//呼叫通知父層關閉modal
const submitProduct = async () => {
  // 呼叫 Store 的方法，並等待結果 (使用 await)
  const success = await productsStore.updateProduct(tempProduct.value);

  if (success) {
    // 如果成功，關閉 Modal
    bsModal.value.hide();
    // 通知父元件更新列表
    emit('update-complete');
  } else {
    // 失敗時可能顯示錯誤訊息等
    console.log("操作失敗，請檢查 API 回應。");
  }
}

// -----------------

//預處理上傳圖片
const uploadFile = async (event) => {
  //讀取選取資料
  const file = event.target.files[0]; // *** 修改這裡，取得第一個檔案 ***
  if (!file) return;

  //建立 FormData 物件
  const formData = new FormData()
  formData.append('file-to-upload', file) // *** 傳入正確的 File 物件 ***

  //後處理
  const imageUrl = await productsStore.uploadFile(formData);

  //回傳存進modal資料
  if (imageUrl) {
    tempProduct.value.imageUrl = imageUrl;
  }

  // 清空 input
  event.target.value = '';
};

// 添加新的方法來處理多張圖片上傳
const uploadFiles = async (event) => {
  const uploadedFiles = event.target.files;
  if (uploadedFiles.length === 0) return;

  // 使用 Promise.all 來並行上傳所有圖片
  const uploadPromises = Array.from(uploadedFiles).map(file => {
    const formData = new FormData();
    // 沿用您的格式: 'file-to-upload'
    formData.append('file-to-upload', file);
    // 呼叫 store 中的上傳方法
    return productsStore.uploadFile(formData);
  });

  try {
    const imageUrls = await Promise.all(uploadPromises);
    // 將所有成功的 URL 添加到 imagesUrl 陣列中
    imageUrls.forEach(url => {
      if (url) {
        tempProduct.value.imagesUrl.push(url);
      }
    });
    // 清空 input file 的值，以便下次可以選擇相同的檔案
    filesInput.value.value = '';

  } catch (error) {
    console.error("多圖上傳失敗:", error);
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
              <div class="col-sm-4">
                <div class="mb-3">
                  <label for="image" class="form-label">輸入圖片網址</label>
                  <input type="text" class="form-control" id="image" placeholder="請輸入圖片連結"
                    v-model="tempProduct.imageUrl">
                </div>
                <div class="mb-3">
                  <label for="customFile" class="form-label">或 上傳圖片
                    <i class="fas fa-spinner fa-spin"></i>
                  </label>
                  <input type="file" id="customFile" class="form-control" @change="uploadFile">
                </div>
                <img class="img-fluid" :src="tempProduct.imageUrl" alt="">
                <!-- 延伸技巧，多圖 -->
                <div class="mt-5">
                  <label for="customFiles" class="form-label">上傳其他圖片</label>
                  <!-- 1. 新增一個支援 multiple 的 input file，綁定 filesInput ref -->
                  <input type="file" id="customFiles" class="form-control mb-3" multiple @change="uploadFiles"
                    ref="filesInput">

                  <!-- 2. 使用 v-for 迴圈來顯示 imagesUrl 陣列中的所有圖片 -->
                  <div v-for="(imgUrl, key) in tempProduct.imagesUrl" :key="key" class="mb-3 input-group">
                    <input type="url" class="form-control" placeholder="請輸入連結" v-model="tempProduct.imagesUrl[key]">
                    <!-- 3. 綁定點擊事件，使用 splice 移除該圖片 -->
                    <button type="button" class="btn btn-outline-danger" @click="tempProduct.imagesUrl.splice(key, 1)">
                      移除
                    </button>
                  </div>

                  <!-- 4. 新增一個按鈕，用於手動添加空的輸入框，方便直接貼上網址 -->
                  <button class="btn btn-outline-primary btn-sm d-block w-100" @click="tempProduct.imagesUrl.push('')"
                    type="button">
                    新增圖片欄位
                  </button>
                </div>
              </div>
              <div class="col-sm-8">
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
                    <input class="form-check-input" type="checkbox" :true-value="1" :false-value="0" id="is_enabled"
                      v-model="tempProduct.is_enabled">
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

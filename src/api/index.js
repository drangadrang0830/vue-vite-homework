import axios from 'axios'

const APIurl = import.meta.env.VITE_APP_API
const PATHurl = import.meta.env.VITE_APP_PATH

const request = axios.create({
  baseURL: APIurl
})

request.interceptors.request.use(
  (config) => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response 攔截器
request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      document.cookie = 'hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    }
    return Promise.reject(error)
  }
)

export default request

/** --- 管理員相關 (Admin) --- **/
export const adminAuth = {
  login: (data) => request.post('/admin/signin', data),
  logout: () => request.post('/logout'),
  check: () => request.post('/api/user/check')
}

export const adminProducts = {
  get: (page = 1) => request.get(`/api/${PATHurl}/admin/products?page=${page}`),
  update: (id, data) =>
    id
      ? request.put(`/api/${PATHurl}/admin/product/${id}`, { data })
      : request.post(`/api/${PATHurl}/admin/product`, { data }),
  delete: (id) => request.delete(`/api/${PATHurl}/admin/product/${id}`),
  upload: (formData) => request.post(`/api/${PATHurl}/admin/upload`, formData)
}

export const adminArticles = {
  get: (page = 1) => request.get(`/api/${PATHurl}/admin/articles?page=${page}`),
  getSingle: (id) => request.get(`/api/${PATHurl}/admin/article/${id}`),
  update: (id, data) =>
    id
      ? request.put(`/api/${PATHurl}/admin/article/${id}`, { data })
      : request.post(`/api/${PATHurl}/admin/article`, { data }),
  delete: (id) => request.delete(`/api/${PATHurl}/admin/article/${id}`)
}

export const adminOrders = {
  get: (page = 1) => request.get(`/api/${PATHurl}/admin/orders?page=${page}`),
  delete: (id) => request.delete(`/api/${PATHurl}/admin/order/${id}`)
}

export const adminCoupons = {
  get: (page = 1) => request.get(`/api/${PATHurl}/admin/coupons?page=${page}`),
  add: (data) => request.post(`/api/${PATHurl}/admin/coupon`, { data }),
  update: (id, data) => request.put(`/api/${PATHurl}/admin/coupon/${id}`, { data }),
  delete: (id) => request.delete(`/api/${PATHurl}/admin/coupon/${id}`)
}

/** --- 前台相關 (User) --- **/
export const userProducts = {
  getAll: () => request.get(`/api/${PATHurl}/products/all`),
  getSingle: (id) => request.get(`/api/${PATHurl}/product/${id}`)
}

export const userCart = {
  get: () => request.get(`/api/${PATHurl}/cart`),
  add: (data) => request.post(`/api/${PATHurl}/cart`, { data }),
  update: (id, data) => request.put(`/api/${PATHurl}/cart/${id}`, { data }),
  delete: (id) => request.delete(`/api/${PATHurl}/cart/${id}`),
  useCoupon: (code) => request.post(`/api/${PATHurl}/coupon`, { data: { code } })
}

export const userOrders = {
  submit: (data) => request.post(`/api/${PATHurl}/order`, { data }),
  get: (id) => request.get(`/api/${PATHurl}/order/${id}`),
  pay: (id) => request.post(`/api/${PATHurl}/pay/${id}`)
}

export const userArticles = {
  getList: () => request.get(`/api/${PATHurl}/articles`),
  getSingle: (id) => request.get(`/api/${PATHurl}/article/${id}`)
}

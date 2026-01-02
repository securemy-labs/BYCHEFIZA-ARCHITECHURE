import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
};

// Product API
export const productAPI = {
  getAll: (params) => apiClient.get('/products', { params }),
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (product) => apiClient.post('/products', product),
  update: (id, product) => apiClient.put(`/products/${id}`, product),
  delete: (id) => apiClient.delete(`/products/${id}`),
};

// Order API
export const orderAPI = {
  getAll: () => apiClient.get('/orders'),
  getById: (id) => apiClient.get(`/orders/${id}`),
  create: (order) => apiClient.post('/orders', order),
  updateStatus: (id, status) => apiClient.put(`/orders/${id}`, { status }),
};

// Payment API
export const paymentAPI = {
  process: (paymentData) => apiClient.post('/payments/process', paymentData),
  getStatus: (id) => apiClient.get(`/payments/${id}`),
  refund: (paymentId) => apiClient.post('/payments/refund', { paymentId }),
};

export default apiClient;

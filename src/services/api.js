import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const menuService = {
  getMenu: () => api.get('/menu'),
  getMenuItem: (id) => api.get(`/menu/${id}`),
};

export const orderService = {
  getOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (orderData) => api.post('/orders', orderData),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}`, { status }),
  simulateProgress: (id) => api.post(`/orders/${id}/simulate`),
};

export default api;
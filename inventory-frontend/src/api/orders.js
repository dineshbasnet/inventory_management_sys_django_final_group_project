import API from './axios';

export const getOrdersAPI = () => API.get('/orders/purchase-orders/');
export const getOrderAPI = (id) => API.get(`/orders/purchase-orders/${id}/`);
export const createOrderAPI = (data) => API.post('/orders/purchase-orders/', data);
export const updateOrderAPI = (id, data) => API.put(`/orders/purchase-orders/${id}/`, data);
export const deleteOrderAPI = (id) => API.delete(`/orders/purchase-orders/${id}/`);
export const approveOrderAPI = (id) => API.post(`/orders/purchase-orders/${id}/approve/`);
export const receiveOrderAPI = (id) => API.post(`/orders/purchase-orders/${id}/receive/`);
import API from './axios';

export const getStockAPI = () => API.get('/stock/');
export const addStockAPI = (data) => API.post('/stock/add/', data);
export const removeStockAPI = (data) => API.post('/stock/remove/', data);
export const adjustStockAPI = (data) => API.post('/stock/adjust/', data);
export const getMovementsAPI = () => API.get('/stock/movements/');
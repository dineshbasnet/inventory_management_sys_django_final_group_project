import API from './axios';

export const getProductsAPI = () => API.get('/products/');
export const getProductByIdAPI = (id) => API.get(`/products/${id}/`);
export const createProductAPI = (data) => API.post('/products/', data);
export const updateProductAPI = (id, data) => API.put(`/products/${id}/`, data);
export const deleteProductAPI = (id) => API.delete(`/products/${id}/`);
export const getLowStockAPI = () => API.get('/products/low_stock/');
export const getCategoriesAPI = () => API.get('/products/categories/');
export const getCategoryByIdAPI = (id) => API.get(`/products/categories/${id}/`);
export const createCategoryAPI = (data) => API.post('/products/categories/', data);
export const updateCategoryAPI = (id, data) => API.put(`/products/categories/${id}/`, data);
export const deleteCategoryAPI = (id) => API.delete(`/products/categories/${id}/`);
import API from './axios';

export const getSuppliersAPI = () => API.get('/suppliers/');
export const getSupplierAPI = (id) => API.get(`/suppliers/${id}/`);
export const createSupplierAPI = (data) => API.post('/suppliers/', data);
export const updateSupplierAPI = (id, data) => API.put(`/suppliers/${id}/`, data);
export const deleteSupplierAPI = (id) => API.delete(`/suppliers/${id}/`);
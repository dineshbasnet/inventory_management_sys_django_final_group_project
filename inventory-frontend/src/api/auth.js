import API from './axios';

export const loginAPI = (email, password) => API.post('/auth/login/', { email, password });
export const logoutAPI = (refresh) => API.post('/auth/logout/', { refresh });
export const getMeAPI = () => API.get('/auth/users/me/');
export const getUsersAPI = () => API.get('/auth/users/');
export const createUserAPI = (data) => API.post('/auth/register/', data);
export const updateUserAPI = (id, data) => API.patch(`/auth/users/${id}/`, data);
export const toggleUserStatusAPI = (id, data) => API.patch(`/auth/users/${id}/`, data);
import API from './axios';

export const getDashboardAPI = () => API.get('/reports/dashboard/');
export const getStockReportAPI = () => API.get('/reports/stock/');
export const getMovementReportAPI = (days) => API.get(`/reports/movements/?days=${days}`);
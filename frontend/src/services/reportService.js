import api from './api';

export const fetchReports = () => api.get('/reports');

export const createReport = (payload) =>
  api.post('/reports', payload);

export const fetchReport = (id) =>
  api.get(`/reports/${id}`);

export const deleteReport = (id) =>
  api.delete(`/reports/${id}`);

export const moderateReport = (id, payload) =>
  api.patch(`/reports/${id}/moderate`, payload);
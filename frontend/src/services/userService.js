import api from './api';

export const fetchAdminUsers = () =>
  api.get('/users/admin-users');

export const updateProfile = (payload) =>
  api.patch('/users/profile', payload);
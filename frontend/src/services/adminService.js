import api from './api';

export const fetchAdminStats = () =>
  api.get('/users/admin-stats');
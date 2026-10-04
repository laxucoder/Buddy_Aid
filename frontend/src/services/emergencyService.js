import api from './api';

export const startEmergency = (payload) =>
  api.post('/emergencies', payload);

export const endEmergency = (id, payload = {}) =>
  api.patch(`/emergencies/${id}/end`, payload);

export const updateEmergencyLocation = (id, payload) =>
  api.patch(`/emergencies/${id}/location`, payload);

export const fetchEmergencies = () =>
  api.get('/emergencies');
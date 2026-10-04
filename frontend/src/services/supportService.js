import api from './api';

export const createTicket = (payload) =>
  api.post('/support', payload);

export const fetchSupportTickets = () =>
  api.get('/support');
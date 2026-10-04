import api from './api';

export const fetchContacts = () =>
  api.get('/contacts');

export const createContact = (payload) =>
  api.post('/contacts', payload);

export const updateContact = (id, payload) =>
  api.patch(`/contacts/${id}`, payload);

export const deleteContact = (id) =>
  api.delete(`/contacts/${id}`);
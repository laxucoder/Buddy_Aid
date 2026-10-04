import api from './api';

export const uploadEmergencyRecording = async (blob) => {
  const formData = new FormData();

  formData.append(
    'file',
    blob,
    `emergency-${Date.now()}.webm`
  );

  formData.append('context', 'emergency');

  return api.post('/media/upload', formData);
};
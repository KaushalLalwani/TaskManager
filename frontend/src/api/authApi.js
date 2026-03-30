import api from './axios';

export const authApi = {
  register: (data) => api.post('/api/v1/auth/register', data),
  login: (data) => api.post('/api/v1/auth/login', data),
  getCurrentUser: () => api.get('/api/v1/auth/me'),
};

import api from './axios';

export const taskApi = {
  getTasks: (skip = 0, limit = 10) =>
    api.get('/api/v1/tasks/', { params: { skip, limit } }),
  getTaskById: (taskId) => api.get(`/api/v1/tasks/${taskId}`),
  createTask: (data) => api.post('/api/v1/tasks/', data),
  updateTask: (taskId, data) => api.put(`/api/v1/tasks/${taskId}`, data),
  deleteTask: (taskId) => api.delete(`/api/v1/tasks/${taskId}`),
  getAllTasks: (skip = 0, limit = 10) =>
    api.get('/api/v1/tasks/all', { params: { skip, limit } }),
};

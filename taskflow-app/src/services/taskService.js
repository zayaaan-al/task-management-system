import api from './axiosInstance';

// GET /api/tasks — fetch all tasks for the authenticated user
export const getTasks = (params) => api.get('/tasks', { params });

// GET /api/tasks/:id
export const getTask = (id) => api.get(`/tasks/${id}`);

// POST /api/tasks
export const createTask = (data) => api.post('/tasks', data);

// PUT /api/tasks/:id
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);

// DELETE /api/tasks/:id
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

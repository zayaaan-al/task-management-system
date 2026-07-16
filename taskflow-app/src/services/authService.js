import api from './axiosInstance';

// POST /api/auth/register
export const register = (data) => api.post('/auth/register', data);

// POST /api/auth/login
export const login = (data) => api.post('/auth/login', data);

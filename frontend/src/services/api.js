import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== Auth APIs =====
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// ===== Student APIs =====
export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  getMe: () => api.get('/students/me'),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};


// ===== Attendance APIs =====
export const attendanceAPI = {
  mark: (data) => api.post('/attendance/mark', data),
  markBulk: (data) => api.post('/attendance/mark/bulk', data),
  getByStudent: (id) => api.get(`/attendance/student/${id}`),
  getStudentStats: (id) => api.get(`/attendance/student/${id}/stats`),
  getClass: () => api.get('/attendance/class'),
};

// ===== Marks APIs =====
export const marksAPI = {
  add: (data) => api.post('/marks', data),
  addBulk: (data) => api.post('/marks/bulk', data),
  getByStudent: (id) => api.get(`/marks/student/${id}`),
  getAll: () => api.get('/marks'),
};

// ===== Analytics APIs =====
export const analyticsAPI = {
  getAttendance: () => api.get('/analytics/attendance'),
  getPerformance: () => api.get('/analytics/performance'),
  getTopStudents: () => api.get('/analytics/top-students'),
  getLowAttendance: () => api.get('/analytics/low-attendance'),
};

export default api;

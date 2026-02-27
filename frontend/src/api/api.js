import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Auth ─────────────────────────────────────────────────────
export const getUserInfo = () => API.get('/auth/user/');
export const loginUser = (username, password) =>
  API.post('/auth/login/', { username, password });
export const logoutUser = () => API.post('/auth/logout/');

// ─── Admin ────────────────────────────────────────────────────
export const getAdminStats = () => API.get('/admin/stats/');

// ─── Students ─────────────────────────────────────────────────
export const getStudents = () => API.get('/students/');
export const addStudent = (formData) =>
  API.post('/students/add/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ─── Faculty ──────────────────────────────────────────────────
export const getFaculty = () => API.get('/faculty/');
export const addFaculty = (formData) =>
  API.post('/faculty/add/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ─── Attendance ───────────────────────────────────────────────
export const getAttendance = (search = '') =>
  API.get('/attendance/', { params: { search } });
export const markAttendance = (formData) =>
  API.post('/attendance/mark/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ─── Dashboards ───────────────────────────────────────────────
export const getFacultyDashboard = () => API.get('/faculty/dashboard/');
export const getStudentDashboard = () => API.get('/student/dashboard/');

export default API;

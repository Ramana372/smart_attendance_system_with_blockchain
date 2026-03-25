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

// ─── Students CRUD ────────────────────────────────────────────────
export const getStudents = () => API.get('/students/');
export const addStudent = (formData) =>
  API.post('/students/add/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updateStudent = (id, formData) =>
  API.post(`/students/${id}/update/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteStudent = (id) =>
  API.post(`/students/${id}/delete/`);

// ─── Faculty CRUD ──────────────────────────────────────────────────
export const getFaculty = () => API.get('/faculty/');
export const addFaculty = (formData) =>
  API.post('/faculty/add/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updateFaculty = (id, formData) =>
  API.post(`/faculty/${id}/update/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteFaculty = (id) =>
  API.post(`/faculty/${id}/delete/`);

// ─── Attendance ───────────────────────────────────────────────
export const getAttendance = (search = '') =>
  API.get('/attendance/', { params: { search } });
export const openAttendanceWindow = (formData) =>
  API.post('/attendance/window/open/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const markAttendance = (formData) =>
  API.post('/attendance/mark/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const closeAttendanceWindow = (formData) =>
  API.post('/attendance/window/close/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// ─── Dashboards ───────────────────────────────────────────────
export const getFacultyDashboard = () => API.get('/faculty/dashboard/');
export const getStudentDashboard = () => API.get('/student/dashboard/');

export default API;

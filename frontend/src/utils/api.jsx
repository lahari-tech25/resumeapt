import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // VERY IMPORTANT: sends cookies (for HttpOnly cookie auth)
  timeout: 10000,
});

export default api;

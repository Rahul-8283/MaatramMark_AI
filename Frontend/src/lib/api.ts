import axios from 'axios';

const MODE = import.meta.env.VITE_MODE;
const BASE_URL = MODE === 'production' ? import.meta.env.VITE_BACKEND_URL_PROD : import.meta.env.VITE_BACKEND_URL_DEV;

const api = axios.create({
  baseURL: BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

export default api

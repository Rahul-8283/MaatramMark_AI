import axios from 'axios';
import supabase from './supabaseClient.ts';

const MODE = import.meta.env.VITE_MODE;
const BASE_URL = MODE === 'production' ? import.meta.env.VITE_BACKEND_URL_PROD : import.meta.env.VITE_BACKEND_URL_DEV;

const api = axios.create({
  baseURL: BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// Add a request interceptor to attach the Supabase JWT token
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`
  }
  
  return config
})

export default api

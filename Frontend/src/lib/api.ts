import axios from 'axios'

const BASE = import.meta.env.VITE_BACKEND_URL_PROD || import.meta.env.VITE_BACKEND_URL_DEV || ''

const api = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

export default api

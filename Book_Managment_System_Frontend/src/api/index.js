import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const api = axios.create({
  baseURL: API_URL,  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  config => {
    console.log(`API Request [${config.method.toUpperCase()} ${config.url}]:`, config.data);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => {
    console.log(`API Response [${response.config.method.toUpperCase()} ${response.config.url}]:`, response.data);
    return response;
  },
  error => {
    // Handle errors globally
    console.error('API Error:', error.response?.data || error.message);
    console.error('Error details:', error);
    return Promise.reject(error);
  }
);

export default api;

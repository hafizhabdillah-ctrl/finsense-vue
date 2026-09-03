import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized with retry logic
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh-token') &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register')
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken },
          {
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000,
          }
        );

        const { accessToken } = response.data;
        if (!accessToken) {
          throw new Error('No access token in refresh response');
        }
        
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error('Token refresh failed:', err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Redirect to login on auth failure
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(err);
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error);
      return Promise.reject({
        ...error,
        message: 'Network error. Please check your connection.',
      });
    }

    return Promise.reject(error);
  },
);

export default api;

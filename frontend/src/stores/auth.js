import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api.js';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const loading = ref(true);
  const error = ref(null);

  const fetchProfile = async () => {
    try {
      error.value = null;
      const response = await api.get('/auth/profile');
      user.value = response.data;
      return response.data;
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      user.value = null;
      error.value = 'Failed to load user profile';
      throw err;
    }
  };

  const initAuth = async () => {
    try {
      loading.value = true;
      error.value = null;
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetchProfile();
      }
    } catch (err) {
      console.error('Auth initialization failed:', err);
      user.value = null;
    } finally {
      loading.value = false;
    }
  };

  const login = async (email, password) => {
    try {
      error.value = null;
      loading.value = true;
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user: userData } = response.data;
      
      if (!accessToken || !refreshToken) {
        throw new Error('Missing token in response');
      }
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      user.value = userData;
      return userData;
    } catch (err) {
      error.value = err.response?.data?.error || 'Login failed';
      user.value = null;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      error.value = null;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      user.value = null;
    }
  };

  const register = async (email, password, full_name) => {
    try {
      error.value = null;
      await api.post('/auth/register', { email, password, full_name });
    } catch (err) {
      error.value = err.response?.data?.error || 'Registration failed';
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    try {
      error.value = null;
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to send reset email';
      throw err;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      error.value = null;
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword,
      });
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || 'Failed to reset password';
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    initAuth,
    fetchProfile,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
  };
});

import baseService from './baseService';

const API_URL = '/api/v1/auth';

export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await baseService.post(`${API_URL}/register`, userData);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await baseService.post(`${API_URL}/login`, credentials);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Refresh tokens
  refreshToken: async (refreshToken) => {
    try {
      const response = await baseService.post(`${API_URL}/refresh-token`, { refreshToken });
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  },

  // Logout user
  logout: async (token) => {
    try {
      const response = await baseService.post(`${API_URL}/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  },

  // Get current user profile
  getUserProfile: async (token) => {
    try {
      const response = await baseService.get(`${API_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.data.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
  },

  // Get all users (except current user)
  getAllUsers: async (token) => {
    try {
      const response = await baseService.get(`${API_URL}/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data.data.users;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  }
};
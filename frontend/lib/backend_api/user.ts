import { instance } from '../axios';

export interface User {
  user_id: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  nationality: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'user';
  created_at: Date;
}

interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
  };
}

export const userApi = {
  // Login user
  login: async (credentials: { email: string; password: string }) => {
    try {
      // Validate credentials before sending
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      // Ensure data is properly formatted
      const loginData = {
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password
      };

      console.log('Sending login request:', loginData); // Debug log
      const response = await instance.post<LoginResponse>('/api/users/login', loginData);
      console.log('Login response:', response.data); // Debug log
      return response.data;
    }
    //@ts-nocheck
    catch (error: any) {
      console.log('Login error:', error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Login failed';
        throw new Error(errorMessage);
      } else if (error.request) {
        // Network error
        throw new Error('Network error. Please check your connection.');
      } else {
        // Other errors
        throw new Error(error.message || 'Login failed');
      }
    }
  },

  // Create new user
  createUser: async (userData: Omit<User, 'user_id' | 'created_at'>) => {
    const response = await instance.post<User>('/api/users/create', userData);
    return response.data;
  },

  // Get all users
  getAllUsers: async () => {
    const response = await instance.get<User[]>('/api/users/getAll');
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string) => {
    const response = await instance.get<User>(`/api/users/getID/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, userData: Partial<User>) => {
    const response = await instance.put<User>(`/api/users/update/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string) => {
    const response = await instance.delete(`/api/users/delete/${id}`);
    return response.data;
  },

  // Update user status
  updateUserStatus: async (id: string, status: 'active' | 'inactive') => {
    const response = await instance.patch<User>(`/api/users/${id}/status`, { status });
    return response.data;
  }
};
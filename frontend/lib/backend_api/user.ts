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

export const userApi = {
  // Create new user
  createUser: async (userData: Omit<User, 'user_id' | 'created_at'>) => {
    const response = await instance.post<User>('/api/users', userData);
    return response.data;
  },

  // Get all users
  getAllUsers: async () => {
    const response = await instance.get<User[]>('/api/users');
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string) => {
    const response = await instance.get<User>(`/api/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, userData: Partial<User>) => {
    const response = await instance.put<User>(`/api/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string) => {
    const response = await instance.delete(`/api/users/${id}`);
    return response.data;
  },

  // Update user status
  updateUserStatus: async (id: string, status: 'active' | 'inactive') => {
    const response = await instance.patch<User>(`/api/users/${id}/status`, { status });
    return response.data;
  }
};
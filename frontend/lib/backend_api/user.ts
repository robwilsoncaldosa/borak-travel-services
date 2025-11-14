import { instance } from '../axios';

export type UserStatus = 'active' | 'inactive';
export type UserRole = 'admin' | 'user';

export interface User {
  user_id: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  nationality: string;
  status: UserStatus;
  role: UserRole;
  created_at: Date;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: UserRole;
  };
}

// Utility function for Axios request with timeout and error handling
async function axiosRequest<T>(request: Promise<{ data: T }>): Promise<T> {
  try {
    const response = await request;
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data?.message || 'Request failed');
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error(error.message || 'Request failed');
    }
  }
}

export const userApi = {
  // Login user
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    const loginData = {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    };

    return axiosRequest(userApi.instance.post<LoginResponse>('/api/users/login', loginData));
  },

  // Create new user
  createUser: async (userData: Omit<User, 'user_id' | 'created_at'>): Promise<User> => {
    return axiosRequest(userApi.instance.post<User>('/api/users/create', userData));
  },

  // Get all users
  getAllUsers: async (timeout = 10000): Promise<User[]> => {
    return axiosRequest(
      userApi.instance.get<User[]>('/api/users/getAll', { timeout })
    );
  },

  // Get user by ID
  getUserById: async (id: string, timeout = 10000): Promise<User> => {
    return axiosRequest(
      userApi.instance.get<User>(`/api/users/getID/${id}`, { timeout })
    );
  },

  // Update user
  updateUser: async (id: string, userData: Partial<User>, timeout = 10000): Promise<User> => {
    return axiosRequest(
      userApi.instance.put<User>(`/api/users/update/${id}`, userData, { timeout })
    );
  },

  // Delete user
  deleteUser: async (id: string, timeout = 10000): Promise<{ message: string }> => {
    return axiosRequest(
      userApi.instance.delete<{ message: string }>(`/api/users/delete/${id}`, { timeout })
    );
  },

  // Update user status
  updateUserStatus: async (id: string, status: UserStatus, timeout = 10000): Promise<User> => {
    return axiosRequest(
      userApi.instance.patch<User>(`/api/users/${id}/status`, { status }, { timeout })
    );
  },

  // Axios instance
  instance,
};

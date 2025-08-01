import { useState } from 'react';
import { userApi } from '@/lib/backend_api/user';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userApi.login({ email, password });

      if (!response) {
        throw new Error('Login failed. Please check your credentials.');
      }

      // Store token and user data
      localStorage.setItem('token', response?.token || '');
      localStorage.setItem('user', JSON.stringify(response?.user || {}));

      return response;
    } catch (err: any) {
      console.log('Login error in useAuth:', err);
      
      // Set specific error messages based on the error
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.status === 401) {
        errorMessage = 'Invalid email or password.';
      } else if (err.response?.status === 404) {
        errorMessage = 'User not found.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLogoutLoading(true);
    try {
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear any other auth-related data
      localStorage.removeItem('guestUserId');
      localStorage.removeItem('guestUsername');
      localStorage.removeItem('lastActive');
      
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  return { login, logout, loading, logoutLoading, error };
};

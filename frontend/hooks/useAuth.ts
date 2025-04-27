import { userApi } from '@/lib/backend_api/user';

export const useAuth = () => {
  const login = async (email: string, password: string) => {
    try {
      const response = await userApi.login({ email, password });
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return { login, logout };
};
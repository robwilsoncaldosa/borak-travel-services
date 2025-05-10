import { useState } from 'react';
import { userApi } from '@/lib/backend_api/user';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userApi.login({ email, password });

      // Store token and user data
      localStorage.setItem('token', response?.token || '');
      localStorage.setItem('user', JSON.stringify(response?.user || {}));

      return response;
    } catch (err: any) {
     console.log(err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return { login, logout, loading, error };
};

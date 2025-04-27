export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    redirectToLogin(); // Immediate redirect if no auth data
    return false;
  }
  
  try {
    const parsed = JSON.parse(user);
    if (!parsed || !parsed.role) {
      redirectToLogin(); // Immediate redirect if invalid data
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    redirectToLogin(); // Immediate redirect on error
    return false;
  }
};

export const storeAuthData = (response: { success: boolean; token: string; user: any }) => {
  if (!response.success || !response.token || !response.user) {
    redirectToLogin();
    throw new Error('Invalid authentication data');
  }
  
  localStorage.setItem('token', response.token);
  localStorage.setItem('user', JSON.stringify(response.user));
  
  window.location.replace('/admin/dashboard'); // Use replace instead of href
};

export const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.replace('/admin/login'); // Use replace instead of href
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getUserRole = (): string | null => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  
  try {
    return JSON.parse(user).role;
  } catch {
    return null;
  }
};

export const checkAuthAndRedirect = (): boolean => {
  const isAuth = isAuthenticated();
  if (!isAuth) {
    redirectToLogin();
  }
  return isAuth;
};
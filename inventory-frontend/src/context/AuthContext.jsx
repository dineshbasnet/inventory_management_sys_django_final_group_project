import { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load — if token exists, fetch user from API
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      API.get('/auth/users/me/')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await API.post('/auth/login/', { email, password });
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    // Fetch user from API after login
    const userRes = await API.get('/auth/users/me/');
    setUser(userRes.data);
    return userRes.data;
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      await API.post('/auth/logout/', { refresh });
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
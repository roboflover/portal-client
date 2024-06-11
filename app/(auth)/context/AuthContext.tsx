// AuthContext.tsx

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  role:  string | null;
  error: string | null;
  userId: number | null;
  setUserId: (id: number | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Проверка наличия токена доступа в куках при монтировании компонента
  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      setIsAuthenticated(true); 
      // fetchUserProfile(token);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      const { access_token } = response.data;
      setRole(response.data.role)
      localStorage.setItem('access_token', access_token);
      Cookies.set('access_token', access_token, { expires: 7 });
      setIsAuthenticated(true);
      return response.data.role
    } catch (error) {
      throw error;
      // if (axios.isAxiosError(error) && error.response?.status === 401) {
      //   setError('Unauthorized: Invalid email or password');
      // } else {
      //   setError('Login failed: An unknown error occurred');
      // }
      // setIsAuthenticated(false);
    }
  };

  const logout = () => {
    Cookies.remove('access_token');
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setUserId(null); // Сбрасываем userId при выходе из системы
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout, role, error, userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

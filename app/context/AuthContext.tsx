'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  role: string | null;
  error: string | null;
  userId: number | null;
  setUserId: (id: number | null) => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  // Проверка наличия токена доступа в куках при монтировании компонента
  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      setToken(token); // Устанавливаем токен в состояние
      setIsAuthenticated(true); 
      const decodedToken: { sub: number } = jwtDecode(token);
      setUserId(decodedToken.sub); // Предполагается, что ID пользователя хранится в поле "sub"
    }
  }, []);

  const host = process.env.NEXT_PUBLIC_SERVER;

  if (!host) {
    throw new Error('NEXT_PUBLIC_SERVER is not defined');
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${host}/auth/login`, { email, password });
      //console.log(response)
      const { access_token } = response.data;
      setRole(response.data.role);
      localStorage.setItem('access_token', access_token);
      Cookies.set('access_token', access_token, { expires: 7 });
      setIsAuthenticated(true);

      // const decodedToken: { id: number } = jwtDecode(access_token);
      // setUserId(decodedToken.id); // Предполагается, что ID пользователя хранится в поле "id"

      return response.data.role;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Ошибка при входе');
      } else {
        setError('Неизвестная ошибка');
      }
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('access_token');
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setUserId(null); // Сбрасываем userId при выходе из системы
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout, role, error, userId, setUserId, token }}>
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

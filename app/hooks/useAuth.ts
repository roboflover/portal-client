// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { UserRole } from '@/app/types/roles';

interface User {
  id: string;
  role: UserRole;
}

interface AuthContext {
  user: User | null;
  loading: boolean;
}

export const useAuth = (): AuthContext => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитация получения данных о пользователе
    const fetchUser = async () => {
      try {
        // Здесь вы можете использовать ваш метод аутентификации
        const userData = await getUserData();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};

// Имитация функции получения данных о пользователе
const getUserData = async (): Promise<User> => {
    let value = localStorage.getItem("user") || "";
    const user = JSON.parse(value);
    return user
};

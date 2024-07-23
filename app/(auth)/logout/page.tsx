'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function Login() {
  const { isAuthenticated, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login, error, role } = useAuth();
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    document.cookie = 'cookieName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }, []);

  useEffect(() => {
    console.log('isAuthenticated', isAuthenticated)
    if (isAuthenticated) {
      //router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const rolePlayer = await login(email, password);
      if (rolePlayer !== null) {
        localStorage.setItem('user', JSON.stringify({ email, role: rolePlayer }));
        let value;
        value = localStorage.getItem("user") || "";
        const user = JSON.parse(value);

        setIsLoginSuccessful(true);
        setLoginError(null); // Очистка ошибки если логин успешен
      }
    } catch (error) {
      setIsLoginSuccessful(false);
      setLoginError('Login failed. Please check your credentials.');
    }
  };

  useEffect(() => {
    if (isLoginSuccessful) {
      if (role === 'user') {
        router.push('/profile');
      } else if (role === 'admin') {
        router.push('/admin/dashboard');
      } else if (role === 'promoter') {
        router.push('/profile');
      }
    }
  }, [isLoginSuccessful, role, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Аккаунт</h2>
          <a href="/" onClick={logout} className="block p-2 bg-white dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
          Выход
          </a>
       </div>
    </div>
  );
}

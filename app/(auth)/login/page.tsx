'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(auth)/context/AuthContext';

export default function Login() {
  const {isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { login, error } = useAuth();
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    // Удаление куки при загрузке компонента
    document.cookie = 'cookieName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      setIsLoginSuccessful(true);
      setLoginError(null); // Очистка ошибки если логин успешен
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoginSuccessful(false);
      setLoginError('Login failed. Please check your credentials.');
    }
  };

  useEffect(() => {
    if (isLoginSuccessful) {
      router.push('/profile');
    }
  }, [isLoginSuccessful, router]);

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Вход</button>
      {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
    </form>
  );
}

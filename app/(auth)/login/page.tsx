'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(auth)/context/AuthContext';
import { log } from 'console';

export default function Login() {
  const {isAuthenticated } = useAuth();
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
    if (isAuthenticated) {
      //router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const rolePlayer = await login(email, password);
      if (rolePlayer !== null) {
        //setRole(rolePlayer);
        localStorage.setItem('user', JSON.stringify({ email, role: rolePlayer }));
        let value
        // Get the value from local storage if it exists
        value = localStorage.getItem("user") || "";
        const user = JSON.parse(value);

        // if (user.role === 'admin') {
        //   router.push('/admin/dashboard');
        // } else {
        //   //alert('Invalid credentials');
        // }
      }
      // let role:string = rolePlayer
      // setRole(role);
      // localStorage.setItem('user', JSON.stringify({ email, role }));

      setIsLoginSuccessful(true);
      setLoginError(null); // Очистка ошибки если логин успешен
    } catch (error) {
      //console.error('Login failed:', error);
      setIsLoginSuccessful(false);
      setLoginError('Login failed. Please check your credentials.');
    }
  };

    // Ваша логика аутентификации здесь
    // Пример:



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
    }, [isLoginSuccessful, role, router]); // Добавляем role в массив зависимостей

  return (
    <form onSubmit={handleLogin}>
      <h2>Аккаунт</h2>
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

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RegisterSuccess: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Устанавливаем таймер на 5 секунд для перенаправления на /login
    const timer = setTimeout(() => {
      router.push('/login');
    }, 5000);

    // Очищаем таймер при размонтировании компонента
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Регистрация успешно завершена!</h2>
      </div>
    </div>
  );
};

export default RegisterSuccess;

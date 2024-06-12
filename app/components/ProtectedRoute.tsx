"use client"
// components/ProtectedRoute.tsx
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '@/app/types/roles';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || !allowedRoles.includes(user.role))) {
      router.push('/login'); // Перенаправление на страницу логина или другую страницу
    }
  }, [user, loading, allowedRoles, router]);

  if (loading || !user || !allowedRoles.includes(user.role)) {
    return <div>Loading...</div>; // Отображение загрузки или пустого состояния
  }

  return <>{children}</>;
};

export default ProtectedRoute;

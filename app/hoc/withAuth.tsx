"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent: React.ComponentType, requiredRole: string) => {
  const ComponentWithAuth = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!user || user.role !== requiredRole) {
        router.push('/login');
      }
    }, [router]); // Добавление router в массив зависимостей

    return <WrappedComponent {...props} />;
  };

  // Добавление displayName для компонента
 // ComponentWithAuth.displayName = WithAuth(`${WrappedComponent.displayName || WrappedComponent.name || 'Component'}`);

  return ComponentWithAuth;
};

export default withAuth;

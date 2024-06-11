"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent: React.ComponentType, requiredRole: string) => {
  return (props: any) => {
    const router = useRouter();

    useEffect(() => {
      
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (!user || user.role !== requiredRole) {
        router.push('/login');
      }
    }, []);       

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
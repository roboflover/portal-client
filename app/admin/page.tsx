"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Admin = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div>
      {/* Можно добавить какой-то контент или оставить пустым */}
    </div>
  );
};

export default Admin;

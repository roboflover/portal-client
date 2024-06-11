// app/no-layout/layout.tsx
import { Sidebar } from './dashboard/components/sidebar';
import React from 'react';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
    <div className="min-h-screen flex  bg-gray-800">
      <Sidebar />
      <main className="flex-1 bg-gray-800 text-white p-8">
        {children}
      </main>
    </div>
    </ProtectedRoute>
  );
};
export default Layout;

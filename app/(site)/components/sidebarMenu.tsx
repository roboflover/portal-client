import React, { ReactNode } from 'react';
import { useAuth } from '@/app/(auth)/context/AuthContext';
import { usePathname } from 'next/navigation';

export function SidebarMenu({ isOpen, toggleMenu }:any) {
  const { isAuthenticated, login, logout } = useAuth();
  const pathname = usePathname();
  
  const getLinkClass = (path: string): string => {
    return pathname === path ? 'text-blue-500' : '';
  };

  let operationMenu: ReactNode;

  return (
    <nav
    className={`bg-gray-100 dark:bg-gray-900 ${isOpen ? 'translate-x-0' : 'translate-x-full fixed top-0 right-0 h-full'}`}
  >
{/* <nav> */}
    <div>

      <ul className="space-y-2">
        <li className="block p-2 bg-white dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
          <a href="/profile" className={getLinkClass('/profile')}>
            Профиль
          </a>
        </li>
        <li>
          <a href="#" className="block p-2 bg-white dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            Корзина
          </a>
        </li>
        <li>
          <a href="#" className="block p-2 bg-white dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            Заказы
          </a>
        </li>
        <li>
          <a href="#" className="block p-2 bg-white dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            Промокоды
          </a>
        </li>
        <li>
          <a href="/" onClick={logout} className="block p-2 bg-white dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
          Выход
          </a>
        </li>
        <li>
        <button onClick={toggleMenu} className="top-4 left-4 text-black dark:text-white">
        Закрыть
        </button>
        </li>
      </ul>
    </div>
    </nav>
  );
};
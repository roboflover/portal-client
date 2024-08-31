'use client'

import { ChangeEvent, ReactNode, createContext, useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { usePathname } from 'next/navigation';

interface SidebarContextProps {
  // Добавьте сюда любые свойства, которые вы планируете передавать через контекст
}

const SidebarContext = createContext<SidebarContextProps>({});

export const Menu: React.FC = () => {
  const pathname = usePathname();
  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);

    if (value === 'product') {
      window.location.href = '/product';
    } else if (value === 'print3d') {
      window.location.href = '/print3d';
    }
  };

  useEffect(() => {
    if (pathname === '/product') {
      setSelectedValue('product');
    } else if (pathname === '/print3d') {
      setSelectedValue('print3d');
    } else {
      setSelectedValue(''); // Сброс значения для других страниц
    }
  }, [pathname]);

  const { isAuthenticated, logout } = useAuth();
  const isLargeDevice = true; //useMediaQuery('(min-width:782px)');

  const getLinkClass = (path: string): string => {
    return pathname === path || (path === '/print3d' && pathname.startsWith('/print3d')) ? 'text-blue-500' : '';
  };

  let operationMenu: ReactNode;

  if (isLargeDevice) {
    operationMenu = (
      <nav className="flex justify-center space-x-4 py-2 bg-gray-100 dark:bg-gray-900">
        <a href="/" className={getLinkClass('/')}>Новости</a>
        <a href="/print3d" className={getLinkClass('/print3d')}>3D печать</a>
        {/* <div className="relative inline-block">
          <select
            onChange={handleSelectChange}
            value={selectedValue}
            className="h-7 text-sm font-semibold rounded bg-gray-100 dark:bg-gray-900 text-black dark:text-white px-2"
          >
            <option value="">⇩&nbsp;⇩&nbsp;⇩</option> 
            <option value="product">Продукция</option>
            <option value="print3d">3д печать</option>
          </select>
        </div> */}
        <a href="/contact" className={getLinkClass('/contact')}>Контакты</a>
      </nav>
    );
  } else {
    operationMenu = (
      <p>Documentation</p>
    );
  }

  return (
    <>
      {operationMenu}
    </>
  );
}

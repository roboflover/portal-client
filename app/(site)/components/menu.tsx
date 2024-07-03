'use client'

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { ChangeEvent, ReactNode, createContext, useEffect, useState } from "react";
import { useAuth } from "@/app/(auth)/context/AuthContext";
import { usePathname } from 'next/navigation';

interface SidebarContextProps {
  // Добавьте сюда любые свойства, которые вы планируете передавать через контекст
}

const SidebarContext = createContext<SidebarContextProps>({});

export function Menu() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);

    if (value === 'product') {
      router.push('/product');
    } else if (value === 'print3d') {
      router.push('/print3d');
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
    return pathname === path ? 'text-blue-500' : '';
  };

  let operationMenu: ReactNode;

  if (isLargeDevice) {
    operationMenu = (
      <nav className="flex justify-center space-x-4 py-2 bg-gray-100 dark:bg-gray-900">
        <Link href="/" className={getLinkClass('/')}>Новости</Link>
        <div className="relative inline-block">
          <select
            onChange={handleSelectChange}
            value={selectedValue}
            className="h-7 text-sm font-semibold rounded bg-gray-100 dark:bg-gray-900 text-black dark:text-white px-2"
          >
            <option value="">---</option> {/* Пустой пункт меню */}
            <option value="product">Продукция</option>
            <option value="print3d">3д печать</option>
          </select>
        </div>
        <Link href="/contact" className={getLinkClass('/contact')}>Контакты</Link>
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

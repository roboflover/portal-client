'use client'

import Link from "next/link";
import { ReactNode, createContext } from "react";
import { useAuth } from "@/app/(auth)/context/AuthContext";
import { usePathname } from 'next/navigation';

interface SidebarContextProps {
  // Добавьте сюда любые свойства, которые вы планируете передавать через контекст
}

const SidebarContext = createContext<SidebarContextProps>({});

export function Menu() {
  const { isAuthenticated, logout } = useAuth();
  const isLargeDevice = true //useMediaQuery('(min-width:782px)');

  const pathname = usePathname();

  const getLinkClass = (path: string): string => {
    return pathname === path ? 'text-blue-500' : '';
  };

  let operationMenu: ReactNode;

  if(isLargeDevice){
    operationMenu = (
      <nav className="flex justify-center space-x-4 py-2 bg-gray-100 dark:bg-gray-900">
      {/* <Link href="/games" className={getLinkClass('/games')}>Игры</Link> */}
      <Link href="/projects" className={getLinkClass('/projects')}>Новости</Link>
      <Link href="/exhibitions"  className={getLinkClass('/exhibitions')}>Выставки</Link>
      <Link href="/contact"  className={getLinkClass('/contact')}>Контакты</Link>
      </nav>
  ) }else {
    operationMenu = (

         <p> Documentation </p>

    )
  }
    
    return (
      <>
       {operationMenu}
      </>
    )
  }

  
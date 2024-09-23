'use client'

import React from 'react';
import { Menu } from '@/app/(site)/components/menu' 
import { Logo } from '@/app/(site)/components/logo' 
import { ModeToggle } from '@/app/(site)/components/modeToggle';
import { EnterToggle } from './enterToogle';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { LogIn, Sun } from 'lucide-react';

interface ToggleMenuProps {
  toggleMenu: () => void;
}

export function Header({ toggleMenu }:ToggleMenuProps) {

    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { isAuthenticated, login, logout } = useAuth();

    useEffect(() => {
        setMounted(true);
    }, []);
    
    if (!mounted) {
    return null;
    }

    const cover = theme === 'dark' 
    ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-b border-gray-200 dark:border-gray-700' 
    : 'bg-gradient-to-r from-cyan-500 to-blue-500 border-b border-gray-200 dark:border-gray-700';
    
  return (
<header className={cover}>
  <div className="flex justify-between items-center p-4">
    <Logo />
    <div className="flex items-center space-x-4">
      {/* {isAuthenticated ? (
        <EnterToggle toggleMenu={toggleMenu} />
        ) : (
        <Link href="/login" className="m-0 p-0" legacyBehavior>
          <Button className="mr-5" variant="outline">
            <LogIn />
          </Button>
        </Link>
      )} */}
      <div className="mr-5 px-4 py-2 font-bold text-white border border-gray-300 rounded transition-colors duration-300 animate-fadeInOut">
        +7(903)288-82-86
      </div>
      <ModeToggle />
    </div>
  </div>
  <Menu />
</header>

  );
};

//<Link href="" onClick={logout} className="">Выход</Link>
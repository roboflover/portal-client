'use client'

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function Logo() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    }, []);

    if (!mounted) {
    return null;
    }

    const logoSrc = theme === 'dark' 
    ? 'assets/logo-dark-100px.png' 
    : 'assets/logo-light-100px.png';
    
    return (

        <a href="/"><img src={logoSrc} alt={'Logo'}  /></a>
    )

}
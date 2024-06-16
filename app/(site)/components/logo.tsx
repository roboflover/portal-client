'use client'

import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';

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
    ? 'https://storage.yandexcloud.net/robobug-logo/logo-dark-100px.png' 
    : 'https://storage.yandexcloud.net/robobug-logo/logo-light-100px.png';
    
    return (
      (<Link href="/">

        <Image src={logoSrc} alt="Logo" width={50} height={50}                   priority={true}
                  style={{ width: 'auto', height: 'auto' }} />

      </Link>)
    );

}

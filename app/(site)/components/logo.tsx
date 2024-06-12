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

      <Link href="/">
      <a>
        <Image src={logoSrc} alt="Logo" width={100} height={100} />
      </a>
    </Link>
    
  )

}

<img alt="Logo" loading="lazy" width="100" height="100" decoding="async" data-nimg="1" srcset="/_next/image?url=https%3A%2F%2Fstorage.yandexcloud.net%2Frobobug-logo%2Flogo-dark-100px.png&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fstorage.yandexcloud.net%2Frobobug-logo%2Flogo-dark-100px.png&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fstorage.yandexcloud.net%2Frobobug-logo%2Flogo-dark-100px.png&amp;w=256&amp;q=75" style=""></img>
'use client'

import { Metadata } from 'next';
import { useEffect } from 'react';

// export const metadata: Metadata = {
//     title: 'Contact',
// }

declare global {
    interface Window {
      CDEKWidget: any;
    }
  }

export default function ContactPage() {

// let ddd = new window.CDEKWidget({ from: 'Новосибирск', root: 'cdek-map', apiKey: 'b6dbf69a-02a9-4c16-ab2e-172777c18534', servicePath: 'https://robobug.ru/service.php', defaultLocation: 'Новосибирск' });
  
    useEffect(() => {
        if (typeof window !== 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@cdek-it/widget@3';
          script.async = true;
          script.charset = 'utf-8';
          script.onload = () => {
            new window.CDEKWidget({
              from: 'Новосибирск',
              root: 'cdek-map',
              apiKey: 'yandex-api-key',
              servicePath: 'https://some-site.com/service.php',
              defaultLocation: 'Новосибирск',
            });
          };
          document.body.appendChild(script);
        }
      }, []);    
    
    return (
        <div className="flex flex-col items-center justify-start min-h-screen p-4">

            <div id="cdek-map" className="w-[800px] h-[600px]"></div>

        </div>
    );
}

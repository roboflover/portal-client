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
/*
</script>
*/

    useEffect(() => {
        if (typeof window !== 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@cdek-it/widget@3';
          script.async = true;
          script.onload = () => {
            new window.CDEKWidget({
                from: 'Новосибирск',
                root: 'cdek-map',
                apiKey: '95af15ee-dcb7-4205-af45-90b027553738',
                canChoose: true,
                servicePath: 'http://robobug.ru/service.php',
                hideFilters: {
                    have_cashless: false,
                    have_cash: false,
                    is_dressing_room: false,
                    type: false,
                },
                hideDeliveryOptions: {
                    office: false,
                    door: true,
                },
                popup: false,
                debug: false,
                goods: [
                    {
                        width: 10,
                        height: 10,
                        length: 10,
                        weight: 10,
                    },
                ],
                defaultLocation: [82.9346, 55.0415],
                lang: 'rus',
                currency: 'RUB',
                tariffs: {
                    office: [233, 137, 139],
                    door: [234, 136, 138],
                },
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

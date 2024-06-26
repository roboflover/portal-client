import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useState } from "react";
import { AuthProvider } from "./(auth)/context/AuthContext";
import Script from "next/script";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Робоцветы',
  description:
    'This is a meta description. Welcome to slingacademy.com. Happy coding and have a nice day',
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  
  return (
    <html lang="en" suppressHydrationWarning={true}>
   
      <Head>
      <title>Робоцветы</title>
      <link rel="icon" href="/favicon.ico" />
     
      </Head>
      <body className={inter.className}>
      <Script id="metrika-counter" strategy="afterInteractive">
  {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
 
    ym(97622142, "init", {
          defer: true,
          clickmap:true,
          trackLinks:true,
          accurateTrackBounce:true,
          webvisor:true
    });`
  }
</Script>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}



'use client'
import { Menu } from '@/app/(site)/components/menu'
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/projects');
  return (
          <div>Главная страница 000</div>
  );
}

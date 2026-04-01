
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Game1 from '../../components/Game1';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.replace('/auth/notauthorized');
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen">
      <h1 className="text-4xl font-bold mb-4 text-white">Selamat Datang!</h1>
      <Game1 />
    </div>
  );
}
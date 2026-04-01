'use client';

import { useRouter } from 'next/navigation';

export default function NotAuthorized() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className="flex flex-col items-center gap-6 p-16 rounded-2xl"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          width: '420px',
        }}
      >
        <img
            src="https://cataas.com/cat"
            alt="kucing"
            className="w-full h-52 object-cover rounded-lg"
        />
        <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2">
          ✖ Anda belum login
        </h2>
        <p className="text-white text-sm text-center">
          Silakan login terlebih dahulu.
        </p>
        <button
          onClick={() => router.push('/auth/login')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg"
        >
          ← Kembali
        </button>
      </div>
    </div>
  );
}
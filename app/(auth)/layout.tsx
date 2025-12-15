import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user) return redirect('/dashboard');
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        backgroundImage:
          'linear-gradient(149.39deg, rgba(230, 242, 255, 1) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 249, 230, 1) 100%), linear-gradient(90deg, rgba(250, 250, 250, 1) 0%, rgba(250, 250, 250, 1) 100%)',
      }}
    >
      {children}
    </div>
  );
}

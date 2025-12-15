import { auth } from '@/auth';
import SideBar from '@/components/partial/SideBar';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) return redirect('/login');
  return (
    <div className="flex h-screen bg-gray-50">
      <SideBar />
      <main className="flex-1 overflow-y-auto">
        <div className="">{children}</div>
      </main>
    </div>
  );
}

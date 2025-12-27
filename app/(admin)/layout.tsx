/**
 * Admin Layout Component
 *
 * Layout khusus untuk halaman-halaman admin yang memerlukan autentikasi.
 * Menyediakan structure dashboard dengan sidebar navigasi.
 *
 * Fungsi:
 * - Verifikasi session admin: jika belum login, redirect ke /login
 * - Layout 2-kolom: sidebar (fixed) + main content (scrollable)
 * - Background abu-abu untuk konsistensi visual
 *
 * Props:
 * - children: React.ReactNode - Konten admin pages yang akan dirender
 *
 * Flow:
 * 1. Cek session dengan auth()
 * 2. Jika belum login -> redirect ke /login
 * 3. Jika sudah login -> tampilkan layout dengan sidebar dan content area
 *
 * Layout Structure:
 * - Sidebar: Navigasi admin (fixed width)
 * - Main: Content area (flexible, scrollable)
 */

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

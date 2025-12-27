/**
 * Authentication Layout Component
 *
 * Layout khusus untuk halaman-halaman autentikasi (login, register).
 *
 * Fungsi:
 * - Cek session aktif: jika user sudah login, redirect ke dashboard
 * - Menyediakan background gradient yang menarik untuk halaman auth
 * - Layout centered untuk form login/register
 * - Responsive design dengan padding yang sesuai
 *
 * Props:
 * - children: React.ReactNode - Halaman auth yang akan dirender (login/register)
 *
 * Flow:
 * 1. Cek session dengan auth()
 * 2. Jika sudah login -> redirect ke /dashboard
 * 3. Jika belum login -> tampilkan halaman auth dengan styling khusus
 *
 * Styling:
 * - Full height screen dengan gradient background
 * - Centered content
 * - Responsive padding
 */

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

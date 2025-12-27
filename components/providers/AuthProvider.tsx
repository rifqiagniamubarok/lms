/**
 * Authentication Provider Component
 *
 * Provider wrapper untuk NextAuth SessionProvider yang menyediakan
 * session context ke seluruh aplikasi.
 *
 * Fungsi:
 * - Membungkus aplikasi dengan SessionProvider dari NextAuth
 * - Menyediakan session data ke semua child components
 * - Mengaktifkan hooks seperti useSession di seluruh app
 * - Menangani session management dan persistence
 *
 * Props:
 * - children: React.ReactNode - Seluruh konten aplikasi
 *
 * Usage:
 * Digunakan di root layout untuk membungkus seluruh aplikasi
 * dan mengaktifkan authentication context.
 *
 * Session Features:
 * - User authentication state
 * - Session persistence across page reloads
 * - Automatic token refresh
 * - Protected routes dengan session checks
 *
 * Note:
 * - Harus menggunakan 'use client' karena SessionProvider client-side only
 * - All components dapat akses session dengan useSession hook
 */

'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

/**
 * Root Layout Component
 *
 * Layout utama aplikasi yang membungkus semua halaman dan menyediakan:
 * - Konfigurasi font (Geist Sans & Geist Mono)
 * - Global CSS styling
 * - AuthProvider untuk manajemen autentikasi
 * - MainLayout sebagai wrapper UI utama
 * - Metadata aplikasi (title, description)
 *
 * Component ini akan dirender pada setiap halaman dalam aplikasi.
 *
 * Props:
 * - children: React.ReactNode - Konten halaman yang akan dirender
 *
 * Features:
 * - Font optimization dengan next/font/google
 * - Session management melalui AuthProvider
 * - Responsive layout melalui MainLayout
 * - Anti-aliased text rendering
 */

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import MainLayout from '@/components/layout/MainLayout';
import AuthProvider from '@/components/providers/AuthProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LMS - Learning Management System',
  description: 'A comprehensive learning management system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

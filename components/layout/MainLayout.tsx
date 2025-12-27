/**
 * Main Layout Component
 *
 * Layout utama aplikasi yang menyediakan HeroUI Provider untuk
 * semua komponen UI dalam aplikasi.
 *
 * Fungsi:
 * - Wrapper HeroUIProvider untuk mengaktifkan HeroUI components
 * - Base layout yang membungkus seluruh aplikasi
 * - Menyediakan context untuk HeroUI theming dan styling
 *
 * Props:
 * - children: React.ReactNode - Seluruh konten aplikasi
 *
 * Usage:
 * Komponen ini digunakan di root layout (app/layout.tsx) untuk
 * membungkus seluruh aplikasi dan mengaktifkan HeroUI library.
 *
 * Note:
 * - Harus menggunakan 'use client' karena HeroUIProvider memerlukan client-side
 * - Semua komponen HeroUI akan bekerja setelah dibungkus provider ini
 */

'use client';
import { HeroUIProvider } from '@heroui/react';
import React from 'react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeroUIProvider>{children}</HeroUIProvider>
    </>
  );
}

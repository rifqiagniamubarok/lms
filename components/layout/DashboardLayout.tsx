/**
 * Dashboard Layout Component
 *
 * Layout wrapper untuk halaman-halaman dashboard admin yang menyediakan
 * struktur konsisten dengan navbar dan content area.
 *
 * Features:
 * - Navbar dengan title dan description
 * - Background abu-abu untuk konsistensi visual
 * - Padding content area yang seragam
 * - Full height layout (min-h-screen)
 *
 * Props:
 * - title: string - Judul halaman yang ditampilkan di navbar
 * - description?: string - Deskripsi atau breadcrumb (optional)
 * - children: React.ReactNode - Konten halaman yang akan dirender
 *
 * Usage:
 * Digunakan di halaman admin seperti dashboard, quiz management,
 * student management, dll untuk memberikan struktur UI yang konsisten.
 *
 * Layout Structure:
 * - Navbar (fixed top)
 * - Content area dengan padding
 */

import React from 'react';
import Navbar from '../partial/Navbar';

export default function DashboardLayout({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar title={title} description={description} />
      <div className="p-6">{children}</div>
    </div>
  );
}

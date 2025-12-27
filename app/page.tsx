/**
 * Home Page - Root Landing Page
 *
 * Halaman utama aplikasi yang secara otomatis mengarahkan pengguna
 * ke dashboard setelah mereka mengakses URL root ("/").
 *
 * Fungsi:
 * - Redirect otomatis ke /dashboard
 * - Tidak menampilkan konten apapun, hanya melakukan redirect
 *
 * Flow:
 * 1. User mengakses "/"
 * 2. Komponen ini langsung redirect ke "/dashboard"
 * 3. Dashboard akan menangani logic autentikasi selanjutnya
 */

import { redirect } from 'next/navigation';

export default async function Home() {
  return redirect('/dashboard');
}

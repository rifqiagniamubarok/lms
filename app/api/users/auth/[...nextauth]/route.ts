/**
 * NextAuth.js API Route Handlers for Users
 *
 * Endpoint ini adalah handler NextAuth.js khusus untuk autentikasi users (siswa).
 * Menangani semua request autentikasi user seperti login, logout, dan session management.
 *
 * Methods: GET, POST
 * Route: /api/users/auth/[...nextauth]
 *
 * Endpoints yang ditangani:
 * - /api/users/auth/signin - Login page dan proses untuk users
 * - /api/users/auth/signout - Logout process untuk users
 * - /api/users/auth/session - Session data untuk users
 * - /api/users/auth/callback/[provider] - Callback dari auth provider
 *
 * Configuration: Menggunakan konfigurasi dari auth.ts yang sudah disesuaikan
 * untuk kebutuhan user authentication dalam sistem LMS.
 */

import { handlers } from '@/auth'; // Referring to the auth.ts we just created
export const { GET, POST } = handlers;

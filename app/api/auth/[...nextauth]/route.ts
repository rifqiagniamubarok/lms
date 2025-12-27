/**
 * NextAuth.js API Route Handlers
 *
 * Endpoint ini adalah handler utama untuk autentikasi NextAuth.js.
 * Menangani semua request terkait autentikasi seperti login, logout,
 * session management, dan callback dari provider.
 *
 * Methods: GET, POST
 * Route: /api/auth/[...nextauth]
 *
 * Endpoints yang ditangani:
 * - /api/auth/signin - Halaman dan proses login
 * - /api/auth/signout - Proses logout
 * - /api/auth/session - Mendapatkan session data
 * - /api/auth/csrf - CSRF token
 * - /api/auth/providers - Daftar auth provider
 * - /api/auth/callback/[provider] - Callback dari provider
 *
 * Configuration: Lihat auth.ts untuk konfigurasi provider dan callbacks
 */

import { handlers } from '../../../../auth';

export const { GET, POST } = handlers;

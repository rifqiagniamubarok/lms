/**
 * Next.js Middleware Configuration
 *
 * Middleware untuk menghandle CORS (Cross-Origin Resource Sharing)
 * pada API routes dan request preprocessing.
 *
 * Features:
 * - CORS headers untuk cross-origin requests
 * - Support untuk semua HTTP methods (GET, POST, PUT, DELETE, OPTIONS)
 * - Preflight request handling (OPTIONS)
 * - API-specific middleware application
 *
 * CORS Configuration:
 * - Allow-Origin: * (semua domain - hati-hati untuk production)
 * - Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
 * - Allow-Headers: Content-Type, Authorization
 *
 * Matcher:
 * - Hanya diterapkan pada routes /api/*
 * - Tidak mempengaruhi halaman atau static assets
 *
 * Security Note:
 * - Access-Control-Allow-Origin: '*' tidak aman untuk production
 * - Sebaiknya specify domain yang diizinkan untuk production
 */

// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: res.headers });
  }

  return res;
}

export const config = {
  matcher: '/api/:path*',
};

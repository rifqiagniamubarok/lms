/**
 * API Get All Levels
 *
 * Endpoint ini digunakan untuk mengambil daftar semua level yang tersedia
 * dalam sistem pembelajaran. Digunakan saat registrasi atau melihat level.
 *
 * Method: GET
 * Route: /api/users/level
 * Authentication: Public (tidak perlu login)
 *
 * Response:
 * - levels: Array semua level yang tersedia
 *   - id: ID level
 *   - name: Nama level (contoh: Pemula, Menengah, Lanjutan)
 *   - order: Urutan level
 *   - kkm: Kriteria Ketuntasan Minimal untuk level ini
 */

import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const levels = await prisma.level.findMany({
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        name: true,
        order: true,
        kkm: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: levels,
    });
  } catch (error) {
    return handleError(error);
  }
}

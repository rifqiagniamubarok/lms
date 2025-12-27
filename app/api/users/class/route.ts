/**
 * API Get All Classes
 *
 * Endpoint ini digunakan untuk mengambil daftar semua kelas yang tersedia
 * dalam sistem. Digunakan saat registrasi untuk memilih kelas.
 *
 * Method: GET
 * Route: /api/users/class
 * Authentication: Public (tidak perlu login)
 *
 * Response:
 * - classes: Array semua kelas yang tersedia
 *   - classId: ID kelas
 *   - name: Nama kelas (contoh: Kelas 3, Kelas 4, Kelas 5)
 */

import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const classes = await prisma.class.findMany({
      orderBy: {
        classId: 'asc',
      },
      select: {
        classId: true,
        name: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: classes,
    });
  } catch (error) {
    return handleError(error);
  }
}

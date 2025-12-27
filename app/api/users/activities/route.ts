/**
 * API User Activities Log
 *
 * Endpoint ini digunakan untuk mengambil riwayat aktivitas user
 * seperti quiz yang dikerjakan, level up, badge yang diraih, dll.
 *
 * Method: GET
 * Route: /api/users/activities
 * Authentication: Requires User Login
 *
 * Query Parameters:
 * - page: number (default: 1) - Halaman untuk pagination
 * - limit: number (default: 10) - Jumlah aktivitas per halaman
 *
 * Response:
 * - activities: Array aktivitas user dengan timestamp
 *   - type: Jenis aktivitas (QUIZ_COMPLETED, LEVEL_UP, BADGE_EARNED, dll)
 *   - description: Deskripsi aktivitas
 *   - createdAt: Waktu aktivitas
 *   - metadata: Data tambahan terkait aktivitas
 * - pagination: Info pagination
 */

import { handleAuth } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import { NextResponse } from 'next/server';
import z from 'zod';

const schemaBodyRequest = z.object({
  page: z.number().min(1).default(1).optional(),
  limit: z.number().min(1).default(10).optional(),
});

export async function GET(request: Request) {
  try {
    const decode = await handleAuth(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Validate pagination parameters
    const validatedParams = schemaBodyRequest.parse({ page, limit });
    const { page: validatedPage = 1, limit: validatedLimit = 10 } = validatedParams;
    const skip = (validatedPage - 1) * validatedLimit;

    const user = await prisma.user.findUnique({
      where: { id: decode.id },
    });

    if (!user) {
      throw new ResponseError(404, 'User not found');
    }

    const [notifications, total] = await Promise.all([
      prisma.activity.findMany({
        where: {
          userId: user.id,
        },
        skip,
        take: validatedLimit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.activity.count({
        where: {
          userId: user.id,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / validatedLimit);

    return NextResponse.json({
      success: true,
      data: notifications,
      pagination: {
        page: validatedPage,
        limit: validatedLimit,
        total,
        totalPages,
        hasNextPage: validatedPage < totalPages,
        hasPrevPage: validatedPage > 1,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

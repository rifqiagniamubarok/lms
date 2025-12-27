/**
 * API Quiz Users
 *
 * Endpoint ini digunakan untuk mengambil daftar quiz yang tersedia
 * untuk user berdasarkan kelas dan level mereka.
 *
 * Method: GET
 * Route: /api/users/quiz
 * Authentication: Requires User Login
 *
 * Query Parameters:
 * - page: number (default: 1) - Halaman untuk pagination
 * - limit: number (default: 10) - Jumlah data per halaman
 *
 * Response:
 * - quizzes: Array quiz yang sesuai dengan kelas dan level user
 * - pagination: Info pagination
 * - userStats: Statistik progress user
 */

import { handleAuth } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
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
      return NextResponse.json({
        success: false,
        data: 'User not found',
      });
    }

    const [quizes, total] = await Promise.all([
      prisma.quiz.findMany({
        where: { classId: user.classId, status: 'PUBLISHED' },
        orderBy: {
          level: {
            order: 'asc',
          },
        },
        include: {
          level: { select: { id: true, name: true, order: true } },
          class: { select: { classId: true, name: true } },
          _count: {
            select: {
              questions: true,
            },
          },
          userQuizes: {
            where: { userId: user.id },
          },
        },
        skip,
        take: validatedLimit,
      }),
      prisma.quiz.count({
        where: { classId: user.classId },
      }),
    ]);

    const totalPages = Math.ceil(total / validatedLimit);

    const formatData = quizes.map((quiz) => {
      return {
        id: quiz.id,
        title: quiz.title,
        level: quiz.level.name,
        levelId: quiz.level.id,
        classId: quiz.class.classId,
        duration: quiz.duration,
        totalQuestion: quiz._count.questions,
        pastScore: quiz.userQuizes?.length ? quiz.userQuizes[0].currentScore : null,
      };
    });

    return NextResponse.json({
      success: true,
      data: formatData,
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

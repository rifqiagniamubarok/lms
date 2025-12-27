/**
 * API Admin Student Management
 *
 * Endpoint ini digunakan untuk manajemen data siswa oleh admin.
 * Admin dapat melihat daftar siswa dengan berbagai filter dan pagination.
 *
 * Method: GET - Mengambil daftar siswa
 * Route: /api/admin/student
 * Authentication: Requires Admin
 *
 * Query Parameters:
 * - page: number (default: 1) - Halaman untuk pagination
 * - limit: number (default: 10, max: 100) - Jumlah siswa per halaman
 * - search: string - Pencarian berdasarkan nama atau username
 * - levelId: number - Filter berdasarkan level
 * - classId: number - Filter berdasarkan kelas
 *
 * Response:
 * - students: Array data siswa dengan info level, kelas, dan statistik
 * - pagination: Info pagination (total, hasNext, hasPrev)
 * - summary: Ringkasan statistik siswa
 */

import { handleAuth, handleAuthAdmin } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import { NextResponse } from 'next/server';
import z from 'zod';

const queryParamsSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  levelId: z.number().optional(),
  classId: z.number().optional(),
});

export async function GET(request: Request) {
  try {
    await handleAuthAdmin(request);

    const { searchParams } = new URL(request.url);

    // Parse and validate query parameters
    const queryParams = queryParamsSchema.parse({
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      search: searchParams.get('search') || undefined,
      levelId: searchParams.get('levelId') ? parseInt(searchParams.get('levelId')!) : undefined,
      classId: searchParams.get('classId') ? parseInt(searchParams.get('classId')!) : undefined,
    });

    const { page, limit, search, levelId, classId } = queryParams;
    const skip = (page - 1) * limit;

    // Build where clause for filtering and searching
    const whereClause: Record<string, unknown> = {};

    if (search) {
      whereClause.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (levelId) {
      whereClause.levelId = levelId;
    }

    if (classId) {
      whereClause.classId = classId;
    }

    // Execute queries in parallel
    const [studentRaw, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        include: {
          class: {
            select: {
              classId: true,
              name: true,
            },
          },
          level: {
            select: {
              id: true,
              kkm: true,
              name: true,
              _count: {
                select: {
                  quizzes: {
                    where: {
                      status: 'PUBLISHED',
                    },
                  },
                },
              },
            },
          },
          userQuizes: {
            select: {
              currentScore: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count({
        where: whereClause,
      }),
    ]);

    const totalQuizzes = await prisma.quiz.groupBy({
      by: ['classId', 'levelId'],
      where: {
        status: 'PUBLISHED',
      },
      _count: {
        id: true,
      },
    });

    const students = studentRaw.map((student) => {
      const getTotalQuizzes = totalQuizzes.find((tq) => tq.classId === student.class.classId && tq.levelId === student.level.id);
      let countQuizzes = 0;
      if (getTotalQuizzes) {
        countQuizzes = getTotalQuizzes._count.id;
      }
      return {
        id: student.id,
        name: student.name,
        expLevel: student.expLevel,
        expTotalInPoints: countQuizzes * student.level.kkm,
        expPoints: student.expPoints,
        averageScore: student.userQuizes.length ? Math.round(student.userQuizes.reduce((acc, uq) => acc + (uq.currentScore ?? 0), 0) / student.userQuizes.length) : 0,
        classId: student.class.classId,
        className: student.class.name,
        levelId: student.level.id,
        levelName: student.level.name,
        levelKkm: student.level.kkm,
      };
    });

    const totalPages = Math.ceil(total / limit);

    const classCounter = await prisma.class.findMany({
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: {
        classId: 'asc',
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: students,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        classStats: classCounter.map((cls) => ({
          classId: cls.classId,
          className: cls.name,
          userCount: cls._count.users,
        })),
        filters: {
          search,
          levelId,
          classId,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleError(error);
  }
}

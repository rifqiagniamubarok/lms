/**
 * API Home Dashboard Users
 *
 * Endpoint ini digunakan untuk mengambil data yang ditampilkan
 * di halaman home/dashboard user setelah login.
 *
 * Method: GET
 * Route: /api/users/home
 * Authentication: Requires User Login
 *
 * Response:
 * - user: Data user dengan level dan statistik
 * - availableQuizzes: Quiz yang tersedia untuk dikerjakan
 * - completedQuizzes: Quiz yang sudah selesai dikerjakan
 * - totalExp: Total experience points
 * - badges: Badges yang sudah diraih
 * - progress: Progress pembelajaran per level
 * - recommendations: Rekomendasi quiz selanjutnya
 */

import { handleAuth } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const decode = await handleAuth(request);

    const user = await prisma.user.findUnique({
      where: { id: decode.id },
      include: {
        level: {
          include: {
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
      },
    });

    if (!user) {
      throw new ResponseError(404, 'User not found');
    }

    let isTheLastLevelAndClass = false;

    const nextLevel = await prisma.level.findFirst({
      where: {
        order: user.level.order + 1,
      },
    });

    const userQuiz = await prisma.userQuiz.count({
      where: {
        userId: user.id,
        quiz: {
          level: {
            order: user.level.order,
          },
        },
      },
    });

    if (!nextLevel) {
      const nextClass = await prisma.class.findFirst({
        where: {
          classId: user.classId + 1,
        },
      });

      if (!nextClass) {
        isTheLastLevelAndClass = true;
      }
    }

    const quizCount = await prisma.quiz.count({
      where: {
        status: 'PUBLISHED',
        levelId: user.level.id,
        classId: user.classId,
      },
    });

    const badges = await prisma.badge.findMany({
      include: {
        userBadges: {
          where: {
            userId: decode.id,
          },
        },
      },
      orderBy: {
        expPoints: 'asc',
      },
    });

    const cleanBadges = badges.map((badge) => {
      const userQuiz = badge.userBadges[0];
      return {
        id: badge.id,
        name: badge.name,
        expPoints: badge.expPoints,
        isAwarded: userQuiz ? true : false,
        awardedAt: userQuiz ? userQuiz.createdAt : null,
      };
    });

    const formatResponse = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      classId: user.classId,
      level: user.level.name,
      levelId: user.level.id,
      levelKkm: user.level.kkm,
      levelOrder: user.level.order,
      expPoints: user.expPoints,
      expLevel: user.expLevel,
      maximalPointLevel: quizCount * 100,
      minimumPointLevel: quizCount * user.level.kkm,
      totalQuizInCurrentLevel: quizCount,
      totalQuizTakenInCurrentLevel: userQuiz || 0,
      remainingQuizInCurrentLevel: quizCount - userQuiz || 0,
      badges: cleanBadges,
      next: {
        isTheLastLevelAndClass,
        nextLevelId: nextLevel ? nextLevel.id : isTheLastLevelAndClass ? null : 1,
        nextLevel: nextLevel ? nextLevel.name : isTheLastLevelAndClass ? null : 'Level 1',
        nextClassId: !isTheLastLevelAndClass ? user.classId + 1 : null,
      },
    };

    return NextResponse.json({
      success: true,
      data: formatResponse,
    });
  } catch (error) {
    return handleError(error);
  }
}

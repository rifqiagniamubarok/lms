/**
 * API Admin Student Detail Management
 *
 * Endpoint ini digunakan untuk melihat detail lengkap siswa tertentu
 * beserta statistik dan riwayat pembelajaran mereka.
 *
 * Method: GET - Mengambil detail siswa
 * Route: /api/admin/student/[id]
 * Authentication: Requires Admin
 *
 * Params:
 * - id: string - ID siswa
 *
 * Response:
 * - student: Data lengkap siswa (profile, level, class)
 * - statistics: Statistik pembelajaran siswa
 *   - totalQuizzesCompleted: Total quiz yang sudah dikerjakan
 *   - averageScore: Rata-rata skor
 *   - totalExp: Total experience points
 *   - badgesEarned: Jumlah badge yang diraih
 * - recentActivities: Aktivitas terbaru siswa
 * - quizHistory: Riwayat quiz yang pernah dikerjakan
 * - progress: Progress pembelajaran per level
 */

import { handleAuthAdmin } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import { NextResponse } from 'next/server';
import { includes } from 'zod';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await handleAuthAdmin(request);
    const { id } = await params;
    const studentId = parseInt(id);

    if (!studentId || isNaN(studentId)) {
      return new Response(JSON.stringify({ message: 'Invalid student ID' }), { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        class: true,
        level: true,
      },
    });

    if (!user) {
      throw new ResponseError(404, 'Student not found');
    }

    const quizzes = await prisma.quiz.findMany({
      where: {
        levelId: user.levelId,
        classId: user.classId,
        status: 'PUBLISHED',
      },
      include: {
        userQuizes: {
          where: {
            userId: studentId,
          },
        },
      },
      orderBy: {
        level: {
          order: 'asc',
        },
      },
    });

    const cleanQuizzes = quizzes.map((quiz) => {
      const userQuiz = quiz.userQuizes[0];
      return {
        id: quiz.id,
        title: quiz.title,
        classId: quiz.classId,
        levelId: quiz.levelId,
        status: quiz.status,
        bestScore: userQuiz ? userQuiz.bestScore : null,
        currentScore: userQuiz ? userQuiz.currentScore : null,
        pastScore: userQuiz ? userQuiz.pastScore : null,
      };
    });

    const badges = await prisma.badge.findMany({
      include: {
        userBadges: {
          where: {
            userId: studentId,
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

    const response = {
      name: user.name,
      email: user.email,
      username: user.username,
      class: user.class,
      level: { ...user.level, expTotalInPoints: user.level ? user.level.kkm * cleanQuizzes.length : 0 },
      badges: cleanBadges,
      expLevel: user.expLevel,
      expPoints: user.expPoints,
      quizzes: cleanQuizzes,
    };

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    return handleError(error);
  }
}

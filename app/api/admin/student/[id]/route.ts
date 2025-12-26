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

    const response = {
      name: user.name,
      email: user.email,
      username: user.username,
      class: user.class,
      level: { ...user.level, expTotalInPoints: user.level ? user.level.kkm * cleanQuizzes.length : 0 },
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

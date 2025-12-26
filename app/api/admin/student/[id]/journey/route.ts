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
        status: 'PUBLISHED',
      },
      include: {
        userQuizes: {
          where: {
            userId: studentId,
          },
        },
        class: true,
        level: true,
      },
      orderBy: {
        classId: 'asc',
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
        class: quiz.class,
        levelId: quiz.levelId,
        level: quiz.level,
        status: quiz.status,
        bestScore: userQuiz ? userQuiz.bestScore : null,
        currentScore: userQuiz ? userQuiz.currentScore : null,
        pastScore: userQuiz ? userQuiz.pastScore : null,
      };
    });

    return NextResponse.json({
      success: true,
      data: cleanQuizzes,
    });
  } catch (error) {
    return handleError(error);
  }
}

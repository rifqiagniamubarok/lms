import { handleAuthAdmin } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await handleAuthAdmin(request);
    const { id } = await params;
    const studentId = parseInt(id);

    if (!studentId || isNaN(studentId)) {
      return NextResponse.json({ success: false, message: 'Invalid student ID' }, { status: 400 });
    }

    // Check if student exists
    const user = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
    }

    // Get all published quizzes first
    const quizzes = await prisma.quiz.findMany({
      where: {
        status: 'PUBLISHED',
      },
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
            name: true,
            order: true,
          },
        },
      },
      orderBy: [
        {
          classId: 'asc',
        },
        {
          levelId: 'asc',
        },
      ],
    });

    // Get user quiz data separately
    const userQuizzes = await prisma.userQuiz.findMany({
      where: {
        userId: studentId,
      },
      select: {
        quizId: true,
        bestScore: true,
        currentScore: true,
        pastScore: true,
      },
    });

    // Create a map for quick lookup
    const userQuizMap = new Map();
    userQuizzes.forEach((uq) => {
      userQuizMap.set(uq.quizId, uq);
    });

    const cleanQuizzes = quizzes.map((quiz) => {
      const userQuiz = userQuizMap.get(quiz.id);
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

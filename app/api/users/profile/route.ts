import { handleAuth } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import { NextResponse } from 'next/server';
import z from 'zod';

export async function GET(request: Request) {
  try {
    const decode = await handleAuth(request);

    // Validate pagination parameters

    const user = await prisma.user.findUnique({
      where: { id: decode.id },
      include: {
        level: true,
      },
    });

    if (!user) {
      throw new ResponseError(404, 'User not found');
    }

    const quiz = await prisma.quiz.findMany({
      where: { classId: user.classId, levelId: user.levelId, status: 'PUBLISHED' },
      include: {
        userQuizes: true,
      },
    });

    const quizResponse = quiz.map((q) => {
      {
        const userQuiz = q.userQuizes.find((uq) => uq.userId === user.id);
        return {
          id: q.id,
          title: q.title,
          bestScore: userQuiz ? userQuiz.bestScore : null,
          currentScore: userQuiz ? userQuiz.currentScore : null,
          isPassed: userQuiz && userQuiz.currentScore && userQuiz.currentScore >= user.level.kkm ? true : false,
        };
      }
    });

    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      level: {
        id: user.level.id,
        name: user.level.name,
        kkm: user.level.kkm,
      },
      quizzes: quizResponse,
    };

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    return handleError(error);
  }
}

const schemaValidation = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
});

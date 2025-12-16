import { handleAuth } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import { addSeconds, isAfter, isBefore } from 'date-fns';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const decode = await handleAuth(request);

    const { id } = await params;

    const quizCount = await prisma.quiz.count({
      where: { id: parseInt(id) },
    });

    if (quizCount === 0) {
      throw new ResponseError(404, 'Quiz not found');
    }

    const userQuiz = await prisma.userQuiz.findFirst({
      where: {
        userId: decode.id,
        quizId: parseInt(id),
        startAt: {
          not: null,
        },
        endAt: {
          not: null,
        },
        quiz: {
          status: 'PUBLISHED',
        },
      },
      include: {
        quiz: {
          include: {
            level: {
              select: { id: true, name: true, order: true, kkm: true },
            },
          },
        },
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: userQuiz,
      }),
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

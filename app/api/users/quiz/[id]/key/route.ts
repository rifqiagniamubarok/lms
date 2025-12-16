import { handleAuth } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import { addSeconds, isAfter, isBefore } from 'date-fns';
import z from 'zod';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const quizCount = await prisma.quiz.count({
      where: { id: parseInt(id) },
    });

    if (quizCount === 0) {
      throw new ResponseError(404, 'Quiz not found');
    }

    const quizQuestions = await prisma.quizQuestion.findMany({
      where: { quizId: parseInt(id) },
      include: {
        options: {
          where: {
            isCorrect: true,
          },
        },
      },
    });

    const formatResponse = quizQuestions.map((qq) => ({
      questionId: qq.id,
      selectedOptionId: qq.options[0].id,
    }));

    return new Response(
      JSON.stringify({
        answer: formatResponse,
      }),
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

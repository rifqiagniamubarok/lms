/**
 * API Quiz Detail by ID
 *
 * Endpoint ini digunakan untuk mengambil detail quiz tertentu beserta
 * status pengerjaan user dan informasi quiz session yang sedang berjalan.
 *
 * Method: GET
 * Route: /api/users/quiz/[id]
 * Authentication: Requires User Login
 *
 * Params:
 * - id: string - ID quiz yang ingin diambil detailnya
 *
 * Response:
 * - quiz: Detail quiz (title, description, timeLimit, questions count)
 * - userQuizStatus: Status pengerjaan user (NOT_STARTED, IN_PROGRESS, COMPLETED)
 * - currentSession: Info sesi quiz yang sedang berjalan (jika ada)
 * - remainingTime: Sisa waktu pengerjaan (jika sedang mengerjakan)
 * - canStart: Boolean apakah user bisa memulai quiz
 * - results: Hasil quiz jika sudah selesai
 */

import { handleAuth } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import { addSeconds, isAfter, isBefore } from 'date-fns';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const decode = await handleAuth(request);

    const user = await prisma.user.findUnique({
      where: { id: decode.id },
      include: {
        level: true,
      },
    });

    if (!user) {
      throw new ResponseError(404, 'User not found');
    }

    const { id } = await params;

    const quiz = await prisma.quiz.findFirst({
      where: { id: parseInt(id), status: 'PUBLISHED', classId: user.classId },
      include: {
        level: true,
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });

    if (!quiz) {
      throw new ResponseError(404, 'Quiz not found');
    }

    const userQuiz = await prisma.userQuiz.findFirst({
      where: {
        userId: decode.id,
        quizId: quiz.id,
      },
    });

    const isInQuiz = (userQuiz && userQuiz.endAt && isBefore(new Date(), userQuiz.endAt)) || false;
    const availForQuiz = quiz.level.order <= user.level.order;

    const formatResponse = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      duration: quiz.duration,
      totalQuestions: quiz._count.questions,
      levelId: quiz.levelId,
      level: quiz.level.name,
      kkm: quiz.level.kkm,
      class: quiz.classId,
      isInQuiz,
      availForQuiz,
      hasDone: userQuiz ? true : false,
      currentScore: userQuiz ? userQuiz.currentScore : null,
      startTime: userQuiz ? userQuiz.startAt : null,
      endTime: userQuiz ? userQuiz.endAt : null,
    };

    return new Response(
      JSON.stringify({
        success: true,
        data: formatResponse,
      }),
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

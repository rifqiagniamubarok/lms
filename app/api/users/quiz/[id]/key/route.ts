/**
 * API Quiz Answer Key
 *
 * Endpoint ini digunakan untuk mengambil kunci jawaban quiz.
 * Biasanya digunakan untuk review setelah quiz selesai dikerjakan.
 *
 * Method: GET
 * Route: /api/users/quiz/[id]/key
 * Authentication: Requires User Login
 *
 * Params:
 * - id: string - ID quiz
 *
 * Response:
 * - questions: Array soal dengan jawaban yang benar
 *   - question: Teks soal
 *   - options: Pilihan jawaban
 *   - correctAnswer: Jawaban yang benar
 *   - explanation: Penjelasan jawaban (jika ada)
 *
 * Note: Endpoint ini hanya mengembalikan kunci jawaban,
 * tidak menampilkan jawaban user atau skor.
 */

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

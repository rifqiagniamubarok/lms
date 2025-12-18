import { handleAuth } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import { shuffle } from '@/utils/shuffle';
import { addMinutes, addSeconds, differenceInSeconds, isAfter, isBefore, isEqual } from 'date-fns';
import format from 'date-fns/format';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const decode = await handleAuth(request);

    const { id } = await params;

    const getUser = await prisma.user.findUnique({
      where: { id: decode.id },
      include: {
        level: {
          select: { id: true, name: true, order: true },
        },
      },
    });

    if (!getUser) {
      throw new ResponseError(404, 'User not found');
    }

    const quiz = await prisma.quiz.findFirst({
      where: { id: parseInt(id), classId: getUser.classId, status: 'PUBLISHED' },
      include: {
        level: {
          select: { id: true, name: true, order: true },
        },
      },
    });

    if (!quiz) {
      throw new ResponseError(404, 'Quiz not found');
    }

    if (quiz.level.order > getUser.level.order) {
      throw new ResponseError(403, 'Your level is not sufficient to take this quiz');
    }

    let startTime = new Date();
    let endTime = addMinutes(startTime, quiz.duration);

    const existingUserQuiz = await prisma.userQuiz.findFirst({
      where: { userId: getUser.id, quizId: quiz.id },
    });

    if (existingUserQuiz && existingUserQuiz.startAt && existingUserQuiz.endAt && isAfter(startTime, existingUserQuiz.endAt)) {
      await prisma.userQuiz.update({
        where: { id: existingUserQuiz.id },
        data: {
          startAt: startTime,
          endAt: endTime,
        },
      });
    } else if (existingUserQuiz && (!existingUserQuiz.startAt || !existingUserQuiz.endAt)) {
      await prisma.userQuiz.update({
        where: { id: existingUserQuiz.id },
        data: {
          startAt: startTime,
          endAt: endTime,
        },
      });
    } else if (existingUserQuiz && existingUserQuiz.startAt && existingUserQuiz.endAt && isBefore(startTime, existingUserQuiz.endAt)) {
      endTime = existingUserQuiz.endAt;
      startTime = existingUserQuiz.startAt;
    } else if (!existingUserQuiz) {
      await prisma.userQuiz.create({
        data: {
          userId: getUser.id,
          quizId: quiz.id,
          startAt: startTime,
          endAt: endTime,
        },
      });
    }

    const questionsRaw = await prisma.quizQuestion.findMany({
      where: { quizId: quiz.id },
      include: {
        options: {
          select: {
            id: true,
            option: true,
          },
        },
      },
    });

    const questions = shuffle(questionsRaw).map((question) => ({
      ...question,
      options: shuffle(question.options),
    }));

    const remainingSeconds = differenceInSeconds(endTime, new Date());
    const safeRemaining = Math.max(0, remainingSeconds);

    return NextResponse.json(
      {
        success: true,
        data: {
          title: quiz.title,
          description: quiz.description,
          duration: quiz.duration,
          classId: quiz.classId,
          level: quiz.level,
          startAt: format(startTime, 'yyyy-MM-dd HH:mm:ss'),
          endAt: format(endTime, 'yyyy-MM-dd HH:mm:ss'),
          remainingTimeInSeconds: safeRemaining,
          totalQuestions: questions.length,
          questions: questions.map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options,
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

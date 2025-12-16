import { handleAuth } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import { addSeconds, isAfter, isBefore } from 'date-fns';
import z from 'zod';

const schemaBodyRequest = z.object({
  answer: z.array(
    z.object({
      questionId: z.number(),
      selectedOptionId: z.number(),
    })
  ),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
        user: {
          include: {
            level: {
              select: {
                id: true,
                order: true,
              },
            },
          },
        },
        _count: {
          select: {
            userQuizHistories: true,
          },
        },
      },
    });

    if (!userQuiz || !userQuiz.startAt || !userQuiz.endAt) {
      throw new ResponseError(400, 'User has not started this quiz');
    }

    const endTime = addSeconds(userQuiz.endAt, 5);

    if (isAfter(new Date(), endTime)) {
      throw new ResponseError(400, 'The time to answer the quiz has expired');
    }

    const body = await request.json();
    const validatedBody = schemaBodyRequest.parse(body);
    const { answer } = validatedBody;

    const getQuestion = await prisma.quizQuestion.findMany({
      where: { quizId: parseInt(id) },
      include: {
        options: {
          select: { id: true, isCorrect: true },
        },
      },
    });

    const questions = getQuestion.map((question) => {
      const userAnswer = answer.find((ans) => ans.questionId === question.id);
      const correctOption = question.options.find((option) => option.isCorrect);

      return {
        questionId: question.id,
        selectedOptionId: userAnswer ? userAnswer.selectedOptionId : null,
        isCorrect: userAnswer ? userAnswer.selectedOptionId === correctOption?.id : false,
      };
    });

    const totalCorrect = questions.filter((q) => q.isCorrect).length;
    const score = (totalCorrect / getQuestion.length) * 100;
    const passed = score >= userQuiz.quiz.level.kkm;

    const expScoreBefore = userQuiz.currentScore || 0;
    const expBefore = userQuiz.user.expLevel;
    const expChanges = score - expScoreBefore;
    const expAfter = userQuiz.quiz.level.order == userQuiz.user.level.order ? expBefore + expChanges : expBefore;

    const currentBestScore = userQuiz.bestScore || 0;
    const differenceBestScore = score > currentBestScore ? score - currentBestScore : 0;

    const attempt = userQuiz._count.userQuizHistories + 1;

    // Execute all database operations in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user quiz history
      if (userQuiz.startAt === null) {
        throw new ResponseError(400, 'User has not started this quiz');
      }

      await tx.userQuizHistory.create({
        data: {
          userQuizId: userQuiz.id,
          score,
          attempt,
          startAt: userQuiz.startAt,
          endAt: new Date(),
        },
      });

      const bestScore = userQuiz.bestScore && userQuiz.bestScore > score ? userQuiz.bestScore : score;

      // Update user quiz
      await tx.userQuiz.update({
        where: { id: userQuiz.id },
        data: {
          pastScore: userQuiz.currentScore,
          currentScore: score,
          bestScore,
          startAt: null,
          endAt: null,
        },
      });

      // Update user experience points
      await tx.user.update({
        where: { id: decode.id },
        data: { expLevel: expAfter, expPoints: { increment: differenceBestScore } },
      });

      const levelQuizNotStarted = await tx.quiz.count({
        where: {
          status: 'PUBLISHED',
          levelId: userQuiz.quiz.level.id,
          userQuizes: {
            none: {
              userId: decode.id,
            },
          },
        },
      });

      const levelQuizNotPassed = await tx.quiz.count({
        where: {
          status: 'PUBLISHED',
          levelId: userQuiz.quiz.level.id,
          userQuizes: {
            some: {
              userId: decode.id,
              currentScore: {
                lt: userQuiz.quiz.level.kkm,
              },
            },
          },
        },
      });

      const totalRemainingQuizInThisLevel = levelQuizNotStarted + levelQuizNotPassed;

      let isFinishedAllLevelAndClass = false;
      let isLevelUp = false;
      let isClassUp = false;
      let nextLevel;
      let nextClass;

      if (totalRemainingQuizInThisLevel === 0) {
        nextLevel = await tx.level.findFirst({
          where: { order: userQuiz.quiz.level.order + 1 },
        });

        isLevelUp = true;

        if (!nextLevel) {
          isClassUp = true;
          nextClass = await tx.class.findFirst({
            where: { classId: userQuiz.quiz.classId + 1 },
          });

          if (!nextClass) {
            isFinishedAllLevelAndClass = true;
          } else {
            const lowerLevel = await tx.level.findFirst({
              orderBy: {
                order: 'asc',
              },
              select: { id: true },
            });
            if (!lowerLevel) {
              throw new ResponseError(500, 'Level data is corrupted');
            }
            await tx.user.update({
              where: { id: decode.id },
              data: { classId: nextClass.classId, levelId: lowerLevel?.id, expLevel: 0 },
            });
          }
        } else {
          await tx.user.update({
            where: { id: decode.id },
            data: { levelId: nextLevel.id, expLevel: 0 },
          });
        }
      }

      return {
        totalRemainingQuizInThisLevel,
        isFinishedAllLevelAndClass,
        isLevelUp,
        isClassUp,
        nextLevel,
        nextClass,
        levelQuizNotStarted,
        levelQuizNotPassed,
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          result: {
            totalQuestions: getQuestion.length,
            totalCorrect,
            score,
            kkm: userQuiz.quiz.level.kkm,
            passed,
          },
          exp: {
            expLevelBefore: expBefore,
            expLevelChanges: expChanges,
            expLevelNow: expAfter,
            expPointsGained: differenceBestScore,
            expPointsNow: userQuiz.user.expPoints + differenceBestScore,
            expLevelTotal: result.totalRemainingQuizInThisLevel * userQuiz.quiz.level.kkm,
            expLevelRemainingToLevelUp: result.totalRemainingQuizInThisLevel * userQuiz.quiz.level.kkm - expAfter,
          },
          quizInThisLevel: {
            notStarted: result.levelQuizNotStarted,
            notPassed: result.levelQuizNotPassed,
            remaining: result.totalRemainingQuizInThisLevel,
          },
          user: {
            isFinishedAllLevelAndClass: result.isFinishedAllLevelAndClass,
            isLevelUp: result.isLevelUp,
            isClassUp: result.isClassUp,
            currenLevel: userQuiz.quiz.level,
            nextLevel: result.nextLevel || null,
            currentClassId: userQuiz.quiz.classId,
            nextClass: result.nextClass?.classId || null,
          },
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

import { handleAuth } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import { addSeconds, isAfter, isBefore } from 'date-fns';
import { NextResponse } from 'next/server';
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

    const getQuiz = await prisma.quiz.findFirst({
      where: { id: parseInt(id) },
      include: {
        level: true,
      },
    });

    if (!getQuiz) {
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

    console.log({ currentScore: userQuiz.currentScore });

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
    const expFinals = expBefore + expChanges;
    const expAfter = expFinals;

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
          quizId: userQuiz.quiz.id,
          classId: userQuiz.quiz.classId,
          levelId: userQuiz.quiz.levelId,
          startAt: userQuiz.startAt,
          endAt: new Date(),
        },
      });

      const bestScore = userQuiz.bestScore && userQuiz.bestScore > score ? userQuiz.bestScore : score;

      // Update user quiz
      await tx.userQuiz.update({
        where: { id: userQuiz.id },
        data: {
          pastScore: expScoreBefore,
          currentScore: score,
          bestScore: bestScore,
          startAt: null,
          endAt: null,
        },
      });

      await tx.activity.create({
        data: {
          userId: decode.id,
          title: `Menyelesaikan kuis ${userQuiz.quiz.title} `,
          point: expChanges,
        },
      });

      // Update user experience points
      await tx.user.update({
        where: { id: decode.id },
        data: { expLevel: expAfter, expPoints: { increment: differenceBestScore } },
      });

      const finalExpPoints = userQuiz.user.expPoints + differenceBestScore;

      // Badge
      const badges = await tx.badge.findMany({
        where: {
          expPoints: {
            lte: finalExpPoints,
          },
          userBadges: {
            none: {
              userId: decode.id,
            },
          },
        },
        select: {
          name: true,
          id: true,
        },
        orderBy: {
          expPoints: 'asc',
        },
      });

      const newBadge = badges[badges.length - 1];

      if (badges.length > 0) {
        await tx.userBadge.createMany({
          data: badges.map((badge) => ({
            userId: decode.id,
            badgeId: badge.id,
          })),
        });

        await tx.notification.create({
          data: {
            userId: decode.id,
            title: 'Selamat!',
            message: `Kamu baru saja mendapatkan badge "${newBadge?.name}" karena telah mencapai ${finalExpPoints} poin pengalaman.`,
          },
        });
      }

      await tx.notification.create({
        data: {
          userId: decode.id,
          title: 'Selamat!',
          message: `Kamu baru saja menyelesaikan soal "${userQuiz.quiz.title}" dengan score ${score.toFixed(2)}%.`,
        },
      });

      const levelQuizNotStarted = await tx.quiz.count({
        where: {
          status: 'PUBLISHED',
          levelId: userQuiz.quiz.level.id,
          classId: userQuiz.quiz.classId,
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
          classId: userQuiz.quiz.classId,
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

      const levelQuizAll = await tx.quiz.count({
        where: {
          status: 'PUBLISHED',
          levelId: getQuiz.levelId,
          classId: getQuiz.classId,
        },
      });

      const minimumExpLevel = userQuiz.quiz.level.kkm * levelQuizAll;
      const maximalExpLevel = 100 * levelQuizAll;

      const totalRemainingQuizInThisLevel = levelQuizNotStarted + levelQuizNotPassed;
      const remainingExpInThisLevel = totalRemainingQuizInThisLevel * userQuiz.quiz.level.kkm - expAfter;

      let isFinishedAllLevelAndClass = false;
      let isLevelUp = false;
      let isClassUp = false;
      let nextLevel;
      let nextClass;

      if (totalRemainingQuizInThisLevel === 0 && expAfter >= minimumExpLevel) {
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

            await tx.notification.create({
              data: {
                userId: decode.id,
                title: 'Selamat!',
                message: `Kamu baru saja menyelesaikan semua level dan kelas yang tersedia.`,
              },
            });
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

            await tx.notification.create({
              data: {
                userId: decode.id,
                title: 'Selamat!',
                message: `Kamu baru saja naik kelas ke ${nextClass.name}.`,
              },
            });
          }
        } else {
          await tx.user.update({
            where: { id: decode.id },
            data: { levelId: nextLevel.id, expLevel: 0 },
          });

          await tx.notification.create({
            data: {
              userId: decode.id,
              title: 'Selamat!',
              message: `Kamu baru saja naik level ke ${nextLevel.name}.`,
            },
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
        levelQuizAll,
        remainingExpInThisLevel,
        minimumExpLevel,
        maximalExpLevel,
        quizScore: score,
        beforeScore: expScoreBefore,
        expChanges,
        expScoreBefore,
        newBadge,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          result: {
            totalQuestions: getQuestion.length,
            totalCorrect,
            score,
            kkm: userQuiz.quiz.level.kkm,
            passed,
          },
          newBadge: result.newBadge || null,
          exp: {
            quizScore: result.quizScore,
            beforeScore: result.beforeScore,
            expLevelBefore: result.expScoreBefore,
            expLevelChanges: result.expChanges,
            expLevelNow: expAfter,
            expPointsGained: differenceBestScore,
            expPointsNow: userQuiz.user.expPoints + differenceBestScore,
            expLevelTotalMinimum: result.minimumExpLevel,
            expLevelTotal: result.maximalExpLevel,
            expLevelRemainingToLevelUp: result.remainingExpInThisLevel < 0 ? 0 : result.remainingExpInThisLevel,
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
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

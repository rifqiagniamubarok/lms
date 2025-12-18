import { handleAuth } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const decode = await handleAuth(request);

    const user = await prisma.user.findUnique({
      where: { id: decode.id },
      include: {
        level: {
          include: {
            _count: {
              select: {
                quizzes: {
                  where: {
                    status: 'PUBLISHED',
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new ResponseError(404, 'User not found');
    }

    let isTheLastLevelAndClass = false;

    const nextLevel = await prisma.level.findFirst({
      where: {
        order: user.level.order + 1,
      },
    });

    const userQuiz = await prisma.userQuiz.count({
      where: {
        userId: user.id,
        quiz: {
          level: {
            order: user.level.order,
          },
        },
      },
    });

    if (!nextLevel) {
      const nextClass = await prisma.class.findFirst({
        where: {
          classId: user.classId + 1,
        },
      });

      if (!nextClass) {
        isTheLastLevelAndClass = true;
      }
    }

    const quizCount = await prisma.quiz.count({
      where: {
        status: 'PUBLISHED',
        levelId: user.level.id,
        classId: user.classId,
      },
    });

    const formatResponse = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      classId: user.classId,
      level: user.level.name,
      levelId: user.level.id,
      levelKkm: user.level.kkm,
      levelOrder: user.level.order,
      expPoints: user.expPoints,
      expLevel: user.expLevel,
      maximalPointLevel: quizCount * 100,
      minimumPointLevel: quizCount * user.level.kkm,
      totalQuizInCurrentLevel: quizCount,
      totalQuizTakenInCurrentLevel: userQuiz || 0,
      remainingQuizInCurrentLevel: quizCount - userQuiz || 0,
      next: {
        isTheLastLevelAndClass,
        nextLevelId: nextLevel ? nextLevel.id : isTheLastLevelAndClass ? null : 1,
        nextLevel: nextLevel ? nextLevel.name : isTheLastLevelAndClass ? null : 'Level 1',
        nextClassId: !isTheLastLevelAndClass ? user.classId + 1 : null,
      },
    };

    return NextResponse.json({
      success: true,
      data: formatResponse,
    });
  } catch (error) {
    return handleError(error);
  }
}

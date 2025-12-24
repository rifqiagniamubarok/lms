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
  email: z.string().email().optional(),
});

export async function PUT(request: Request) {
  try {
    const decode = await handleAuth(request);

    const body = await request.json();
    const validatedData = schemaValidation.parse(body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: decode.id },
    });

    if (!existingUser) {
      throw new ResponseError(404, 'User not found');
    }

    // If email or username is being updated, check for uniqueness
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });
      if (emailExists) {
        throw new ResponseError(400, 'Email already in use');
      }
    }

    if (validatedData.username && validatedData.username !== existingUser.username) {
      const usernameExists = await prisma.user.findUnique({
        where: { username: validatedData.username },
      });
      if (usernameExists) {
        throw new ResponseError(400, 'Username already in use');
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: decode.id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    return handleError(error);
  }
}

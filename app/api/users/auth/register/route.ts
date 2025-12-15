import { hashPassword } from '@/utils/encryption';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import { NextResponse } from 'next/server';
import z from 'zod';

const schemaValidation = z.object({
  name: z.string().min(3),
  username: z.string().min(3),
  classId: z.number().int().positive(),
  email: z.string().email().optional(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedBody = schemaValidation.parse(body);

    const checkClass = await prisma.class.findUnique({
      where: {
        classId: validatedBody.classId,
      },
    });

    if (!checkClass) {
      throw new ResponseError(404, 'Class not found');
    }

    const lowerLevel = await prisma.level.findFirst({
      orderBy: {
        order: 'asc',
      },
    });

    if (!lowerLevel) {
      throw new ResponseError(404, 'Level not created yet');
    }

    const newUser = await prisma.user.create({
      data: {
        name: validatedBody.name,
        username: validatedBody.username,
        email: validatedBody.email || null,
        password: await hashPassword(validatedBody.password),
        classId: validatedBody.classId,
        levelId: lowerLevel.id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    return handleError(error);
  }
}

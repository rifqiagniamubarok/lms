import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const classes = await prisma.class.findMany({
      orderBy: {
        classId: 'asc',
      },
      select: {
        classId: true,
        name: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: classes,
    });
  } catch (error) {
    return handleError(error);
  }
}

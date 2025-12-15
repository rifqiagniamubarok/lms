import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const levels = await prisma.level.findMany({
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        name: true,
        order: true,
        kkm: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: levels,
    });
  } catch (error) {
    return handleError(error);
  }
}

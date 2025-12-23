import { handleAuth } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import { NextResponse } from 'next/server';
import z from 'zod';

const schemaBodyRequest = z.object({
  page: z.number().min(1).default(1).optional(),
  limit: z.number().min(1).default(10).optional(),
});

export async function GET(request: Request) {
  try {
    const decode = await handleAuth(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Validate pagination parameters
    const validatedParams = schemaBodyRequest.parse({ page, limit });
    const { page: validatedPage = 1, limit: validatedLimit = 10 } = validatedParams;
    const skip = (validatedPage - 1) * validatedLimit;

    const user = await prisma.user.findUnique({
      where: { id: decode.id },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        data: 'User not found',
      });
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: {
          userId: {
            in: [user.id, null],
          },
        },
        skip,
        take: validatedLimit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.notification.count({
        where: {
          userId: {
            in: [user.id, null],
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / validatedLimit);

    return NextResponse.json({
      success: true,
      data: notifications,
      pagination: {
        page: validatedPage,
        limit: validatedLimit,
        total,
        totalPages,
        hasNextPage: validatedPage < totalPages,
        hasPrevPage: validatedPage > 1,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

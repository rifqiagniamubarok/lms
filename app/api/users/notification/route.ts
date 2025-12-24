import { handleAuth } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
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
      throw new ResponseError(404, 'User not found');
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: {
          userId: user.id,
        },
        skip,
        take: validatedLimit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.notification.count({
        where: {
          userId: user.id,
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

const schemaPostRequest = z.object({
  notifId: z.number().optional().nullable(),
  readAll: z.boolean().optional().default(false).nullable(),
});

export async function POST(request: Request) {
  try {
    const decode = await handleAuth(request);

    const body = await request.json();
    const { notifId, readAll } = schemaPostRequest.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: decode.id },
    });

    if (!user) {
      throw new ResponseError(404, 'User not found');
    }

    if (readAll) {
      await prisma.notification.updateMany({
        where: {
          userId: user.id,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });
    } else if (notifId) {
      const notification = await prisma.notification.findUnique({
        where: { id: notifId, userId: user.id },
      });

      if (!notification || notification.userId !== user.id) {
        throw new ResponseError(404, 'Notification not found');
      }

      await prisma.notification.update({
        where: { id: notifId },
        data: {
          isRead: true,
        },
      });
    } else {
      throw new ResponseError(400, 'Invalid request parameters');
    }

    return NextResponse.json({
      success: true,
      data: 'Notification(s) marked as read',
    });
  } catch (error) {
    return handleError(error);
  }
}

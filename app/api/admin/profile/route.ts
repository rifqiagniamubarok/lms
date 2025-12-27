/**
 * API Admin Profile Management
 *
 * Endpoint ini digunakan untuk mengambil dan mengupdate profile admin.
 *
 * Method: GET - Mengambil data profile admin
 * Method: PUT - Mengupdate data profile admin
 * Route: /api/admin/profile
 * Authentication: Requires Admin
 *
 * GET Response:
 * - admin: Data profile admin (name, email, phone, bio)
 *
 * PUT Body:
 * - name: string - Nama admin
 * - email: string - Email admin
 * - phone: string - Nomor telepon admin
 * - bio: string - Bio/deskripsi admin
 *
 * Response:
 * - Success: Data admin yang telah diupdate
 * - Error: 400 jika data tidak valid, 404 jika admin tidak ditemukan
 */

import { handleAuthAdmin } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import { NextResponse } from 'next/server';
import z from 'zod';

export async function GET(request: Request) {
  try {
    // Authenticate admin
    const decode = await handleAuthAdmin(request);

    const user = await prisma.admin.findFirst({
      where: {
        id: Number(decode.id),
      },
      select: {
        name: true,
        email: true,
        phone: true,
      },
    });

    if (!user) {
      throw new ResponseError(404, 'User not found');
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return handleError(error);
  }
}

const schemaBody = z.object({
  name: z.string().min(3).max(30),
  email: z.string().email(),
  phone: z.string().min(10).max(15).optional(),
});

export async function PUT(request: Request) {
  try {
    // Authenticate admin
    const decode = await handleAuthAdmin(request);

    const body = await request.json();
    const parsedBody = schemaBody.parse(body);
    const { name, email, phone } = parsedBody;

    const updatedUser = await prisma.admin.update({
      where: {
        id: Number(decode.id),
      },
      data: {
        name,
        email,
        phone,
      },
      select: {
        name: true,
        email: true,
        phone: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    return handleError(error);
  }
}

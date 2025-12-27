/**
 * API Register User
 *
 * Endpoint ini digunakan untuk mendaftarkan user (siswa) baru ke dalam sistem.
 *
 * Method: POST
 * Route: /api/users/auth/register
 *
 * Body:
 * - name: string (minimal 3 karakter) - Nama lengkap siswa
 * - username: string (minimal 3 karakter) - Username untuk login
 * - classId: number - ID kelas yang akan diikuti
 * - email: string (optional) - Email siswa
 * - password: string (minimal 6 karakter) - Password untuk login
 *
 * Response:
 * - Success: Data user baru yang telah terdaftar
 * - Error: 400 jika data tidak valid, 409 jika username sudah digunakan
 */

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

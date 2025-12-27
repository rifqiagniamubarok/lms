/**
 * API Login User
 *
 * Endpoint ini digunakan untuk melakukan autentikasi login user (siswa).
 * User dapat login menggunakan username dan password, dengan opsi "remember me".
 *
 * Method: POST
 * Route: /api/users/auth/login
 *
 * Body:
 * - username: string (minimal 3 karakter)
 * - password: string (minimal 6 karakter)
 * - isRemember: boolean (optional) - untuk menyimpan sesi login lebih lama
 *
 * Response:
 * - Success: User data dengan token JWT
 * - Error: 404 jika user tidak ditemukan, 401 jika password salah
 */

import { comparePassword, generateToken, hashPassword } from '@/utils/encryption';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import { NextResponse } from 'next/server';
import z from 'zod';

const schemaValidation = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  isRemember: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedBody = schemaValidation.parse(body);

    const user = await prisma.user.findUnique({
      where: {
        username: validatedBody.username,
      },
      include: {
        class: true,
        level: true,
      },
    });

    if (!user) {
      throw new ResponseError(404, 'User not found');
    }

    if (!user.password) {
      throw new ResponseError(400, 'Password not set for this user');
    }

    const isPasswordValid = await comparePassword(validatedBody.password, user.password);

    if (!isPasswordValid) {
      throw new ResponseError(401, 'Invalid password');
    }

    const tokenPayload = {
      id: user.id,
      username: user.username,
    };

    const token = generateToken(tokenPayload, '2h');

    if (validatedBody.isRemember) {
      const longToken = generateToken(tokenPayload, '30d');
      await prisma.user.update({
        where: { id: user.id },
        data: { currentToken: token, rememberToken: longToken },
      });
    }

    const response = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      expLevel: user.expLevel,
      expPoints: user.expPoints,
      classId: user.class.classId,
      class: user.class.name,
      levelId: user.level.id,
      level: user.level.name,
      token,
    };

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    return handleError(error);
  }
}

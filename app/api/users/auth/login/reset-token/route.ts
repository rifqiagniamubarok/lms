/**
 * API Reset/Refresh Authentication Token
 *
 * Endpoint ini digunakan untuk me-refresh atau reset token autentikasi user
 * ketika token lama hampir expired atau perlu diperbarui.
 *
 * Method: POST
 * Route: /api/users/auth/login/reset-token
 * Authentication: Requires valid current token
 *
 * Body:
 * - username: string (minimal 3 karakter) - Username user
 * - currentToken: string (minimal 10 karakter) - Token yang sedang aktif
 *
 * Response:
 * - Success: Token baru dengan expired time yang diperpanjang
 * - Error: 401 jika token tidak valid, 404 jika user tidak ditemukan
 *
 * Use Case:
 * - Memperpanjang sesi login tanpa perlu login ulang
 * - Refresh token sebelum expired
 * - Mempertahankan state "remember me"
 */

import { comparePassword, generateToken, hashPassword, verifyToken } from '@/utils/encryption';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import { NextResponse } from 'next/server';
import z from 'zod';

const schemaValidation = z.object({
  username: z.string().min(3),
  currentToken: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedBody = schemaValidation.parse(body);

    const user = await prisma.user.findUnique({
      where: {
        username: validatedBody.username,
      },
    });

    if (!user) {
      throw new ResponseError(404, 'User not found');
    }

    if (!user.rememberToken) {
      throw new ResponseError(400, 'User does not remember login');
    }

    if (user.currentToken !== validatedBody.currentToken) {
      throw new ResponseError(401, 'Invalid current token');
    }

    const isValid = verifyToken(user.rememberToken);

    if (!isValid) {
      throw new ResponseError(401, 'Remember token expired');
    }

    const tokenPayload = {
      id: user.id,
      username: user.username,
    };

    const token = generateToken(tokenPayload, '1h');

    await prisma.user.update({
      where: { id: user.id },
      data: { currentToken: token },
    });

    const response = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      expLevel: user.expLevel,
      expPoints: user.expPoints,
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

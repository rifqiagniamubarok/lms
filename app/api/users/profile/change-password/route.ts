/**
 * API Change Password User
 *
 * Endpoint ini digunakan untuk mengubah password user yang sedang login.
 * User perlu memasukkan password lama untuk verifikasi.
 *
 * Method: PUT
 * Route: /api/users/profile/change-password
 * Authentication: Requires User Login
 *
 * Body:
 * - pastPassword: string (minimal 6 karakter) - Password lama untuk verifikasi
 * - newPassword: string (minimal 6 karakter) - Password baru
 * - newPasswordConfirmation: string - Konfirmasi password baru (harus sama)
 *
 * Response:
 * - Success: Konfirmasi password berhasil diubah
 * - Error: 400 jika password lama salah atau konfirmasi tidak match
 */

import { comparePassword, hashPassword } from '@/utils/encryption';
import { handleAuth } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import { NextResponse } from 'next/server';
import z from 'zod';

const schmeValidation = z
  .object({
    pastPassword: z.string().min(6, 'Past password must be at least 6 characters long'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
    newPasswordConfirmation: z.string().min(6, 'New password confirmation must be at least 6 characters long'),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirmation, {
    message: 'New password and confirmation do not match',
  });

export async function PUT(request: Request) {
  try {
    const decode = await handleAuth(request);

    const existingUser = await prisma.user.findUnique({
      where: { id: decode.id },
    });

    if (!existingUser || !existingUser.password) {
      throw new ResponseError(404, 'User not found');
    }

    const body = await request.json();
    const { pastPassword, newPassword } = schmeValidation.parse(body);

    const isPasswordMatch = await comparePassword(pastPassword, existingUser.password);

    if (!isPasswordMatch) {
      throw new ResponseError(400, 'Past password is wrong');
    }

    const hashPsw = await hashPassword(newPassword);

    const newUser = await prisma.user.update({
      where: { id: decode.id },
      data: { password: hashPsw },
      select: {
        id: true,
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

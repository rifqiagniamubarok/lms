/**
 * API Admin Reset Password
 *
 * Endpoint ini digunakan untuk mengubah password admin.
 * Admin perlu memasukkan password lama untuk verifikasi.
 * Setelah berhasil mengubah password, sesi akan logout otomatis.
 *
 * Method: PUT
 * Route: /api/admin/profile/reset-password
 * Authentication: Requires Admin
 *
 * Body:
 * - pastPassword: string (6-100 karakter) - Password lama untuk verifikasi
 * - newPassword: string (6-100 karakter) - Password baru
 * - confirmNewPassword: string - Konfirmasi password baru (harus sama)
 *
 * Response:
 * - Success: Konfirmasi password berhasil diubah
 * - Error: 400 jika password lama salah atau konfirmasi tidak match
 *
 * Note: Setelah berhasil, admin akan otomatis logout dan perlu login ulang
 */

import { signOut } from '@/auth';
import { comparePassword, hashPassword } from '@/utils/encryption';
import { handleAuthAdmin } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import z from 'zod';

const schemaBody = z
  .object({
    pastPassword: z.string().min(6).max(100),
    newPassword: z.string().min(6).max(100),
    confirmNewPassword: z.string().min(6).max(100),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New password and confirm new password do not match',
  });

export async function PUT(request: Request) {
  try {
    // Authenticate admin
    const decode = await handleAuthAdmin(request);

    const body = await request.json();
    const parsedBody = schemaBody.parse(body);

    const { pastPassword, newPassword } = parsedBody;

    const user = await prisma.admin.findFirst({
      where: {
        id: Number(decode.id),
      },
    });

    if (!user || !user.password) {
      throw new ResponseError(404, 'User not found');
    }

    const isPastPasswordValid = await comparePassword(pastPassword, user.password);

    if (!isPastPasswordValid) {
      throw new ResponseError(400, 'Past password is incorrect');
    }

    const newHashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: {
        id: Number(decode.id),
      },
      data: {
        password: newHashedPassword,
      },
    });

    await signOut();

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          email: user.email,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

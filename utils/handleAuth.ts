/**
 * Authentication Handler Utilities
 *
 * Kumpulan fungsi untuk menangani autentikasi dan autorisasi
 * dalam API routes dengan berbagai metode authentication.
 *
 * Functions:
 * - handleAuth: Verifikasi JWT token dari header Authorization
 * - handleAuthAdmin: Verifikasi session admin menggunakan NextAuth
 * - handleDecode: Helper untuk decode token data
 *
 * Usage:
 * - User APIs menggunakan handleAuth dengan Bearer token
 * - Admin APIs menggunakan handleAuthAdmin dengan NextAuth session
 *
 * Error Handling:
 * - Throw ResponseError dengan status 401 jika unauthorized
 * - Automatic token verification dan validation
 */

import { auth } from '@/auth';
import { verifyToken } from './encryption';
import ResponseError from './ResponseError';

const handleDecode = async (
  deocode: unknown
): Promise<{
  id: number;
  username: string;
}> => {
  return {
    id: (deocode as { id: number; username: string }).id,
    username: (deocode as { id: number; username: string }).username,
  };
};

export const handleAuth = async (req: Request) => {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    throw new ResponseError(401, 'Invalid or expired token');
  }

  const token = auth.split(' ')[1];

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    throw new ResponseError(401, 'Invalid or expired token');
  }

  return handleDecode(decodedToken);
};

export const handleAuthAdmin = async (req: Request) => {
  const session = await auth();

  if (!session?.user) {
    throw new ResponseError(401, 'Invalid or expired token');
  }

  return session.user;
};

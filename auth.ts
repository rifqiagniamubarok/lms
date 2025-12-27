/**
 * NextAuth Configuration
 *
 * Konfigurasi autentikasi menggunakan NextAuth v5 dengan custom credentials provider.
 * Menghandle login admin dengan email/password authentication.
 *
 * Features:
 * - Custom credentials provider dengan database validation
 * - Email dan password authentication
 * - Session management dengan JWT
 * - Type extensions untuk User dan Session
 * - Password verification dengan bcrypt
 *
 * Providers:
 * - Credentials: Email + password login untuk admin
 *
 * Database Integration:
 * - Menggunakan Prisma untuk query admin data
 * - Password comparison dengan bcrypt
 * - User validation dan error handling
 *
 * Session Configuration:
 * - JWT-based sessions
 * - User ID included dalam session
 * - Custom session dan user types
 *
 * Security:
 * - Password tidak disimpan dalam session
 * - Bcrypt password verification
 * - Secure session management
 */

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './utils/prisma';
import z from 'zod';
import { comparePassword } from './utils/encryption';

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id?: string;
  }
}

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password is required' }),
  // rememberMe removed
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const validation = loginSchema.safeParse(credentials);

          if (!validation.success) {
            return null;
          }

          const { email, password } = validation.data;

          const user = await prisma.admin.findUnique({
            where: { email },
          });

          if (!user) {
            return null;
          }
          const isPasswordValid = await comparePassword(password, user.password);
          if (!isPasswordValid) {
            return null;
          }

          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Include user id in JWT token
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Include user id in session
      if (token.id && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
});

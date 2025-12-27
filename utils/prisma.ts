/**
 * Prisma Database Client Configuration
 *
 * Konfigurasi dan inisialisasi Prisma Client untuk koneksi database.
 * Menggunakan singleton pattern untuk menghindari multiple connections
 * dan optimasi untuk development environment.
 *
 * Features:
 * - Singleton pattern untuk reuse connection
 * - Development optimization dengan global variable
 * - Production-ready configuration
 *
 * Usage:
 * import { prisma } from '@/utils/prisma';
 * const users = await prisma.user.findMany();
 *
 * Environment Handling:
 * - Development: Menggunakan global variable untuk hot reload
 * - Production: New instance setiap kali import
 *
 * Database Connection:
 * - PostgreSQL database dengan connection string dari .env
 * - Auto-generated Prisma Client dari schema.prisma
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

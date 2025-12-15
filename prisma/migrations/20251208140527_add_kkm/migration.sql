/*
  Warnings:

  - Added the required column `kkm` to the `levels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "levels" ADD COLUMN     "kkm" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "user_quizzes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "quizId" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_quizzes_pkey" PRIMARY KEY ("id")
);

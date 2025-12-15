/*
  Warnings:

  - You are about to drop the column `subjectId` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `quiz_questions` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `quizzes` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `user_quizzes` table. All the data in the column will be lost.
  - You are about to drop the `subjects` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `password` on table `admins` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `duration` to the `quizzes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bestScore` to the `user_quizzes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "quiz_questions" DROP CONSTRAINT "quiz_questions_subjectId_fkey";

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "subjectId",
ALTER COLUMN "password" SET NOT NULL;

-- AlterTable
ALTER TABLE "quiz_questions" DROP COLUMN "subjectId";

-- AlterTable
ALTER TABLE "quizzes" DROP COLUMN "type",
ADD COLUMN     "duration" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user_quizzes" DROP COLUMN "score",
ADD COLUMN     "bestScore" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "username" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "subjects";

-- DropEnum
DROP TYPE "QuizType";

-- CreateTable
CREATE TABLE "user_quiz_histories" (
    "id" SERIAL NOT NULL,
    "userQuizId" INTEGER NOT NULL,
    "attempt" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_quiz_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

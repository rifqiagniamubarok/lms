-- CreateEnum
CREATE TYPE "QuizSatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "quizzes" ADD COLUMN     "status" "QuizSatus" NOT NULL DEFAULT 'DRAFT';

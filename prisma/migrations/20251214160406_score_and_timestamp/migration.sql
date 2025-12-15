/*
  Warnings:

  - Added the required column `endAt` to the `user_quiz_histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `user_quiz_histories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_quiz_histories" ADD COLUMN     "endAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user_quizzes" ADD COLUMN     "currentScore" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "endAt" TIMESTAMP(3),
ADD COLUMN     "pastScore" DOUBLE PRECISION,
ADD COLUMN     "startAt" TIMESTAMP(3),
ALTER COLUMN "bestScore" DROP NOT NULL;

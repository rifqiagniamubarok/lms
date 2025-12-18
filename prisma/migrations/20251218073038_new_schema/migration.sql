/*
  Warnings:

  - Added the required column `classId` to the `user_quiz_histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `levelId` to the `user_quiz_histories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quizId` to the `user_quiz_histories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_quiz_histories" ADD COLUMN     "classId" INTEGER NOT NULL,
ADD COLUMN     "levelId" INTEGER NOT NULL,
ADD COLUMN     "quizId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "user_quiz_histories" ADD CONSTRAINT "user_quiz_histories_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quiz_histories" ADD CONSTRAINT "user_quiz_histories_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("classId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quiz_histories" ADD CONSTRAINT "user_quiz_histories_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

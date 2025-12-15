-- AddForeignKey
ALTER TABLE "user_quiz_histories" ADD CONSTRAINT "user_quiz_histories_userQuizId_fkey" FOREIGN KEY ("userQuizId") REFERENCES "user_quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

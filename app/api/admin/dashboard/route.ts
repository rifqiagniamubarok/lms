import { handleAuthAdmin } from '@/utils/handleAuth';
import handleError from '@/utils/handleError';
import { prisma } from '@/utils/prisma';

export async function GET(request: Request) {
  try {
    await handleAuthAdmin(request);

    // Get total statistics
    const [
      totalStudents,
      totalQuizzes,
      totalClasses,
      totalLevels,
      classStats,
      levelStats,
      quizStats,
      recentStudents,
      needAttentionStudents,
      completionStats,
      quizCompletionHistory,
    ] = await Promise.all([
      // Total students
      prisma.user.count(),

      // Total published quizzes
      prisma.quiz.count({
        where: { status: 'PUBLISHED' },
      }),

      // Total classes
      prisma.class.count(),

      // Total levels
      prisma.level.count(),

      // Students per class
      prisma.class.findMany({
        include: {
          _count: {
            select: { users: true },
          },
        },
        orderBy: { classId: 'asc' },
      }),

      // Students per level
      prisma.level.findMany({
        include: {
          _count: {
            select: { users: true },
          },
        },
        orderBy: { order: 'asc' },
      }),

      // Quiz completion stats by class and level
      prisma.quiz.groupBy({
        by: ['classId', 'levelId'],
        where: { status: 'PUBLISHED' },
        _count: { id: true },
        orderBy: [{ classId: 'asc' }, { levelId: 'asc' }],
      }),

      // Recent students (last 10 registered)
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          class: { select: { name: true } },
          level: { select: { name: true } },
        },
      }),

      // Students who need attention (low average score or exp level)
      prisma.user.findMany({
        include: {
          class: { select: { name: true, classId: true } },
          level: { select: { name: true, kkm: true } },
          userQuizes: {
            select: { currentScore: true },
          },
        },
      }),

      // Quiz completion rate
      prisma.userQuiz.groupBy({
        by: ['quizId'],
        _count: { userId: true },
      }),

      // Quiz completion history from UserQuizHistory
      prisma.userQuizHistory.findMany({
        where: {
          startAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        select: {
          startAt: true,
          score: true,
          userQuiz: {
            select: {
              quiz: {
                select: {
                  title: true,
                  classId: true,
                  levelId: true,
                },
              },
            },
          },
        },
        orderBy: {
          startAt: 'asc',
        },
      }),
    ]);

    // Process students who need attention
    const studentsNeedAttention = needAttentionStudents
      .map((student) => {
        const averageScore = student.userQuizes.length > 0 ? student.userQuizes.reduce((acc, quiz) => acc + (quiz.currentScore ?? 0), 0) / student.userQuizes.length : 0;

        const expPercentage = (student.expLevel / (student.level.kkm || 100)) * 100;

        return {
          ...student,
          averageScore,
          expPercentage,
          needsAttention: averageScore < student.level.kkm || expPercentage < 50,
        };
      })
      .filter((student) => student.needsAttention)
      .slice(0, 5);

    // Calculate quiz completion rate
    const totalPossibleCompletions = totalStudents * totalQuizzes;
    const actualCompletions = completionStats.reduce((acc, stat) => acc + stat._count.userId, 0);
    const completionRate = totalPossibleCompletions > 0 ? Math.round((actualCompletions / totalPossibleCompletions) * 100) : 0;

    // Activity summary for the last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const recentActivity = await prisma.userQuizHistory.groupBy({
      by: ['startAt'],
      where: {
        startAt: { gte: weekAgo },
      },
      _count: { id: true },
    });

    const activityByDay = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayActivity = recentActivity.filter((activity) => activity.startAt.toDateString() === date.toDateString());
      return {
        date: date.toLocaleDateString('id-ID', { weekday: 'short' }),
        count: dayActivity.reduce((acc, act) => acc + act._count.id, 0),
      };
    }).reverse();

    // Process top 5 most completed quizzes
    const quizCompletionCounts: { [key: string]: { title: string; count: number; classId: number; levelId: number } } = {};

    quizCompletionHistory.forEach((history) => {
      const quizTitle = history.userQuiz.quiz.title;
      if (quizCompletionCounts[quizTitle]) {
        quizCompletionCounts[quizTitle].count += 1;
      } else {
        quizCompletionCounts[quizTitle] = {
          title: quizTitle,
          count: 1,
          classId: history.userQuiz.quiz.classId,
          levelId: history.userQuiz.quiz.levelId,
        };
      }
    });

    // Get top 5 most completed quizzes
    const topQuizzes = Object.values(quizCompletionCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Quiz completion by class
    const quizCompletionByClass = Array.from({ length: 3 }, (_, i) => {
      const classId = i + 3; // Classes 3, 4, 5
      const classCompletions = quizCompletionHistory.filter((history) => history.userQuiz.quiz.classId === classId);
      return {
        classId,
        className: `Kelas ${classId}`,
        completions: classCompletions.length,
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          overview: {
            totalStudents,
            totalQuizzes,
            totalClasses,
            totalLevels,
            completionRate,
          },
          classStats: classStats.map((cls) => ({
            classId: cls.classId,
            className: cls.name,
            studentCount: cls._count.users,
          })),
          levelStats: levelStats.map((level) => ({
            levelId: level.id,
            levelName: level.name,
            levelOrder: level.order,
            studentCount: level._count.users,
          })),
          quizDistribution: quizStats.map((quiz) => ({
            classId: quiz.classId,
            levelId: quiz.levelId,
            quizCount: quiz._count.id,
          })),
          recentStudents: recentStudents.map((student) => ({
            id: student.id,
            name: student.name,
            className: student.class.name,
            levelName: student.level.name,
            registeredAt: student.createdAt,
          })),
          needsAttention: studentsNeedAttention.map((student) => ({
            id: student.id,
            name: student.name,
            className: student.class.name,
            levelName: student.level.name,
            averageScore: Math.round(student.averageScore),
            expPercentage: Math.round(student.expPercentage),
            kkm: student.level.kkm,
          })),
          weeklyActivity: activityByDay,
          quizCompletionChart: {
            topQuizzes: topQuizzes,
            classSummary: quizCompletionByClass,
            totalCompletions: quizCompletionHistory.length,
          },
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return handleError(error);
  }
}

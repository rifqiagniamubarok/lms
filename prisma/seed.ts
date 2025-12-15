import { PrismaClient, QuizSatus } from '@prisma/client';
import { hashPassword } from '../utils/encryption';
import dataSoal, { SoalOption } from './soal';

const prisma = new PrismaClient();

async function main() {
  const classPayload = [
    { classId: 3, name: 'Class 3' },
    { classId: 4, name: 'Class 4' },
    { classId: 5, name: 'Class 5' },
  ];

  await Promise.all(
    classPayload.map(async (cls) => {
      return prisma.class.upsert({
        where: { classId: cls.classId },
        update: {
          classId: cls.classId,
        },
        create: {
          classId: cls.classId,
          name: cls.name,
        },
      });
    })
  );

  const levelPayload = [
    {
      name: 'LEVEL 1',
      order: 1,
      kkm: 70,
    },
    {
      name: 'LEVEL 2',
      order: 2,
      kkm: 70,
    },
    {
      name: 'LEVEL 3',
      order: 3,
      kkm: 70,
    },
    {
      name: 'LEVEL 4',
      order: 4,
      kkm: 70,
    },
    {
      name: 'LEVEL 5',
      order: 5,
      kkm: 70,
    },
  ];

  await Promise.all(
    levelPayload.map(async (level) => {
      return prisma.level.upsert({
        where: { name: level.name },
        update: {
          order: level.order,
          kkm: level.kkm,
        },
        create: {
          name: level.name,
          order: level.order,
          kkm: level.kkm,
        },
      });
    })
  );

  const adminPayload = {
    name: 'Admin Mathzy',
    email: 'guru@mathzy.com',
    password: await hashPassword('password123'),
    bio: 'Guru Matematika SMP dengan pengalaman 10 tahun mengajar',
  };

  await prisma.admin.upsert({
    where: { email: adminPayload.email },
    update: {
      name: adminPayload.name,
      bio: adminPayload.bio,
    },
    create: {
      email: adminPayload.email,
      password: adminPayload.password,
      name: adminPayload.name,
      bio: adminPayload.bio,
    },
  });

  for (const soal of dataSoal) {
    const level = await prisma.level.findFirst({ where: { order: soal.level } });
    if (!level) continue;
    const theClass = await prisma.class.findFirst({ where: { classId: soal.class } });
    if (!theClass) continue;

    const existingQuiz = await prisma.quiz.findFirst({
      where: {
        title: soal.title,
        classId: theClass.classId,
        levelId: level.id,
      },
    });
    if (existingQuiz) continue;

    const quiz = await prisma.quiz.create({
      data: {
        title: soal.title,
        description: soal.description,
        levelId: level.id,
        classId: theClass.classId,
        duration: soal.duration,
        status: QuizSatus.PUBLISHED,
      },
    });

    console.log(`Created quiz: ${quiz.title} for Class ${theClass.classId} Level ${level.order}`);

    Promise.all(
      soal.questions.map(async (question) => {
        await prisma.quizQuestion.create({
          data: {
            question: question.question,
            quizId: quiz.id,
            options: {
              createMany: {
                data: question.options,
              },
            },
          },
        });
      })
    );
  }
}

main().then(async () => {
  await prisma.$disconnect();
});

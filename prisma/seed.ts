import { PrismaClient, QuizSatus } from '@prisma/client';
import { hashPassword } from '../utils/encryption';

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

  const quizPayload = {
    title: 'Quiz Matematika Dasar',
    description: 'Quiz untuk menguji pemahaman dasar matematika siswa.',
    levelId: 1,
    classId: 3,
    duration: 30,
    status: QuizSatus.PUBLISHED,
    questions: [
      {
        question: '2 + 2 = ?',
        options: [
          { option: '3', isCorrect: false },
          { option: '4', isCorrect: true },
          { option: '5', isCorrect: false },
          { option: '6', isCorrect: false },
        ],
      },
      {
        question: '5 + 3 = ?',
        options: [
          { option: '7', isCorrect: false },
          { option: '8', isCorrect: true },
          { option: '9', isCorrect: false },
          { option: '6', isCorrect: false },
        ],
      },
      {
        question: '10 - 4 = ?',
        options: [
          { option: '5', isCorrect: false },
          { option: '6', isCorrect: true },
          { option: '7', isCorrect: false },
          { option: '4', isCorrect: false },
        ],
      },
      {
        question: '3 + 6 = ?',
        options: [
          { option: '8', isCorrect: false },
          { option: '9', isCorrect: true },
          { option: '10', isCorrect: false },
          { option: '7', isCorrect: false },
        ],
      },
      {
        question: '9 - 3 = ?',
        options: [
          { option: '5', isCorrect: false },
          { option: '6', isCorrect: true },
          { option: '7', isCorrect: false },
          { option: '8', isCorrect: false },
        ],
      },
      {
        question: '4 + 4 = ?',
        options: [
          { option: '6', isCorrect: false },
          { option: '7', isCorrect: false },
          { option: '8', isCorrect: true },
          { option: '9', isCorrect: false },
        ],
      },
      {
        question: '7 - 2 = ?',
        options: [
          { option: '4', isCorrect: false },
          { option: '5', isCorrect: true },
          { option: '6', isCorrect: false },
          { option: '3', isCorrect: false },
        ],
      },
      {
        question: '6 + 1 = ?',
        options: [
          { option: '6', isCorrect: false },
          { option: '7', isCorrect: true },
          { option: '8', isCorrect: false },
          { option: '5', isCorrect: false },
        ],
      },
      {
        question: '8 - 5 = ?',
        options: [
          { option: '2', isCorrect: false },
          { option: '3', isCorrect: true },
          { option: '4', isCorrect: false },
          { option: '5', isCorrect: false },
        ],
      },
      {
        question: '1 + 9 = ?',
        options: [
          { option: '9', isCorrect: false },
          { option: '10', isCorrect: true },
          { option: '11', isCorrect: false },
          { option: '8', isCorrect: false },
        ],
      },
    ],
  };

  const quizExists = await prisma.quiz.findFirst({ where: { title: quizPayload.title } });

  if (!quizExists) {
    const quiz = await prisma.quiz.create({
      data: {
        title: quizPayload.title,
        description: quizPayload.description,
        levelId: quizPayload.levelId,
        classId: quizPayload.classId,
        duration: quizPayload.duration,
        status: quizPayload.status,
      },
    });

    Promise.all(
      quizPayload.questions.map(async (question) => {
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

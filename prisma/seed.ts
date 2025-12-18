import { PrismaClient, QuizSatus } from '@prisma/client';
import { hashPassword } from '../utils/encryption';
import dataSoal, { SoalOption } from './soal';

const prisma = new PrismaClient();

async function main() {
  const classPayload = [
    { classId: 3, name: 'Kelas 3' },
    { classId: 4, name: 'Kelas 4' },
    { classId: 5, name: 'Kelas 5' },
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

  // Count quizzes by class and level before processing
  const quizCounts: { [key: string]: number } = {};
  const classLevelCounts: { [classId: number]: { [levelId: number]: number } } = {};

  for (const soal of dataSoal) {
    const key = `Class ${soal.class} - Level ${soal.level}`;
    quizCounts[key] = (quizCounts[key] || 0) + 1;

    if (!classLevelCounts[soal.class]) {
      classLevelCounts[soal.class] = {};
    }
    classLevelCounts[soal.class][soal.level] = (classLevelCounts[soal.class][soal.level] || 0) + 1;
  }

  console.log('\n=== QUIZ COUNT SUMMARY ===');
  console.log('Total quizzes in dataset:', dataSoal.length);
  console.log('\nQuiz count by Class and Level:');
  Object.keys(quizCounts).forEach((key) => {
    console.log(`${key}: ${quizCounts[key]} quiz(s)`);
  });

  console.log('\nDetailed breakdown:');
  Object.keys(classLevelCounts).forEach((classId) => {
    const classNum = parseInt(classId);
    console.log(`\nClass ${classNum}:`);
    Object.keys(classLevelCounts[classNum]).forEach((levelId) => {
      const levelNum = parseInt(levelId);
      console.log(`  Level ${levelNum}: ${classLevelCounts[classNum][levelNum]} quiz(s)`);
    });
    const totalForClass = Object.values(classLevelCounts[classNum]).reduce((sum, count) => sum + count, 0);
    console.log(`  Total for Class ${classNum}: ${totalForClass} quiz(s)`);
  });

  console.log('\n=== STARTING QUIZ CREATION ===\n');

  let createdCount = 0;
  let skippedCount = 0;

  for (const soal of dataSoal) {
    const theLevel = await prisma.level.findFirst({ where: { order: soal.level } });
    if (!theLevel) continue;
    const theClass = await prisma.class.findFirst({ where: { classId: soal.class } });
    if (!theClass) continue;

    const existingQuiz = await prisma.quiz.findFirst({
      where: {
        title: soal.title,
        classId: theClass.classId,
        levelId: theLevel.id,
      },
    });
    if (existingQuiz) {
      console.log(`Skipped existing quiz: "${soal.title}" for Class ${theClass.classId} Level ${theLevel.order}`);
      skippedCount++;
      continue;
    }

    const quiz = await prisma.quiz.create({
      data: {
        title: soal.title,
        description: soal.description,
        levelId: theLevel.id,
        classId: theClass.classId,
        duration: soal.duration,
        status: QuizSatus.PUBLISHED,
      },
    });

    createdCount++;

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

  console.log('\n=== SEEDING COMPLETED ===');
  console.log(`Total quizzes processed: ${dataSoal.length}`);
  console.log(`Quizzes created: ${createdCount}`);
  console.log(`Quizzes skipped (already exist): ${skippedCount}`);
  console.log('=========================\n');
}

main().then(async () => {
  await prisma.$disconnect();
});

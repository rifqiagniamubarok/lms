import handleError from '@/utils/handleError';
import { handleAuthAdmin } from '@/utils/handleAuth';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import { createQuizSchema, updateQuizSchema, quizQuerySchema } from '@/utils/validations/quiz';
import { NextResponse } from 'next/server';

// GET /api/admin/quiz - Get all quizzes with filtering
export async function GET(request: Request) {
  try {
    // Authenticate admin
    await handleAuthAdmin(request);

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams);

    const { page, limit, levelId, classId, search } = quizQuerySchema.parse(queryParams);

    // Build where clause for filtering
    const where: import('@prisma/client').Prisma.QuizWhereInput = {};

    if (levelId) where.levelId = levelId;
    if (classId) where.classId = classId;
    if (search) {
      where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get quizzes with related data
    const [quizzes, totalCount] = await Promise.all([
      prisma.quiz.findMany({
        where,
        include: {
          level: { select: { id: true, name: true, order: true } },
          class: { select: { classId: true, name: true } },
          questions: {
            include: {
              options: true,
            },
            orderBy: { createdAt: 'asc' },
          },
          _count: {
            select: {
              questions: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.quiz.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      data: {
        data: quizzes,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

// POST /api/admin/quiz - Create a new quiz with questions and options
export async function POST(request: Request) {
  try {
    // Authenticate admin
    await handleAuthAdmin(request);

    const body = await request.json();
    const validatedData = createQuizSchema.parse(body);

    // Check if level and class exist
    const [level, classEntity] = await Promise.all([
      prisma.level.findUnique({ where: { id: validatedData.levelId } }),
      prisma.class.findUnique({ where: { classId: validatedData.classId } }),
    ]);

    if (!level) {
      throw new ResponseError(404, 'Level not found');
    }

    if (!classEntity) {
      throw new ResponseError(404, 'Class not found');
    }

    // Create quiz with questions and options in a transaction
    const quiz = await prisma.$transaction(async (tx) => {
      // Create the quiz
      const newQuiz = await tx.quiz.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          levelId: validatedData.levelId,
          classId: validatedData.classId,
          duration: validatedData.duration,
          status: validatedData.status,
        },
      });

      // Create questions with their options
      for (const questionData of validatedData.questions) {
        const question = await tx.quizQuestion.create({
          data: {
            quizId: newQuiz.id,
            question: questionData.question,
          },
        });

        // Create options for this question
        await tx.quizOption.createMany({
          data: questionData.options.map((option) => ({
            questionId: question.id,
            option: option.option,
            isCorrect: option.isCorrect,
          })),
        });
      }

      // Return the complete quiz with all related data
      return tx.quiz.findUnique({
        where: { id: newQuiz.id },
        include: {
          level: { select: { id: true, name: true, order: true } },
          class: { select: { classId: true, name: true } },
          questions: {
            include: {
              options: true,
            },
            orderBy: { createdAt: 'asc' },
          },
          _count: {
            select: {
              questions: true,
            },
          },
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Quiz created successfully',
        data: quiz,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

// PUT /api/admin/quiz - Update quiz metadata (not questions/options)
export async function PUT(request: Request) {
  try {
    // Authenticate admin
    await handleAuthAdmin(request);

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      throw new ResponseError(400, 'Quiz ID is required');
    }

    const validatedData = updateQuizSchema.parse(updateData);

    // Check if quiz exists
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingQuiz) {
      throw new ResponseError(404, 'Quiz not found');
    }

    // If levelId or classId is being updated, verify they exist
    if (validatedData.levelId || validatedData.classId) {
      const checks = [];
      if (validatedData.levelId) {
        checks.push(
          prisma.level.findUnique({ where: { id: validatedData.levelId } }).then((level) => {
            if (!level) throw new ResponseError(404, 'Level not found');
          })
        );
      }
      if (validatedData.classId) {
        checks.push(
          prisma.class.findUnique({ where: { classId: validatedData.classId } }).then((classEntity) => {
            if (!classEntity) throw new ResponseError(404, 'Class not found');
          })
        );
      }
      await Promise.all(checks);
    }

    // Update the quiz
    const updatedQuiz = await prisma.quiz.update({
      where: { id: parseInt(id) },
      data: validatedData,
      include: {
        level: { select: { id: true, name: true, order: true } },
        class: { select: { classId: true, name: true } },
        questions: {
          include: {
            options: true,
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Quiz updated successfully',
      data: updatedQuiz,
    });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/admin/quiz - Delete a quiz
export async function DELETE(request: Request) {
  try {
    // Authenticate admin
    await handleAuthAdmin(request);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new ResponseError(400, 'Quiz ID is required');
    }

    // Check if quiz exists
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });

    if (!existingQuiz) {
      throw new ResponseError(404, 'Quiz not found');
    }

    // Delete quiz (cascade will handle questions and options)
    await prisma.quiz.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: 'Quiz deleted successfully',
    });
  } catch (error) {
    return handleError(error);
  }
}

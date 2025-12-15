import handleError from '@/utils/handleError';
import { handleAuthAdmin } from '@/utils/handleAuth';
import { prisma } from '@/utils/prisma';
import ResponseError from '@/utils/ResponseError';
import { createQuizSchema, updateQuizSchema } from '@/utils/validations/quiz';
import { NextResponse } from 'next/server';

// GET /api/admin/quiz/[id] - Get quiz details by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Authenticate admin
    await handleAuthAdmin(request);

    const quizId = parseInt(id);

    if (!quizId || isNaN(quizId)) {
      throw new ResponseError(400, 'Invalid quiz ID');
    }

    // Get quiz with all related data
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        level: { select: { id: true, name: true, order: true, kkm: true } },
        class: { select: { classId: true, name: true } },
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });

    if (!quiz) {
      throw new ResponseError(404, 'Quiz not found');
    }

    // Group questions with their options
    const questions = await prisma.quizQuestion.findMany({
      where: { quizId: quiz.id },
      include: {
        options: {
          select: {
            id: true,
            option: true,
            isCorrect: true,
          },
          orderBy: { id: 'asc' },
        },
      },
      orderBy: { id: 'asc' },
    });

    // Format response with structured questions
    const formattedQuiz = {
      ...quiz,
      questions: questions.map((question) => ({
        id: question.id,
        question: question.question,
        options: question.options,
      })),
    };

    return NextResponse.json({
      success: true,
      data: formattedQuiz,
    });
  } catch (error) {
    return handleError(error);
  }
}

// PUT /api/admin/quiz/[id] - Update quiz with questions and options
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authenticate admin
    await handleAuthAdmin(request);

    const { id } = await params;
    const quizId = parseInt(id);

    if (!quizId || isNaN(quizId)) {
      throw new ResponseError(400, 'Invalid quiz ID');
    }

    const body = await request.json();
    const validatedData = createQuizSchema.parse(body);

    // Check if quiz exists
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id: quizId },
    });

    if (!existingQuiz) {
      throw new ResponseError(404, 'Quiz not found');
    }

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

    // Update quiz with questions and options in a transaction
    const updatedQuiz = await prisma.$transaction(async (tx) => {
      // Update the quiz metadata
      const quiz = await tx.quiz.update({
        where: { id: quizId },
        data: {
          title: validatedData.title,
          description: validatedData.description,
          levelId: validatedData.levelId,
          classId: validatedData.classId,
          duration: validatedData.duration,
          status: validatedData.status,
        },
      });

      // Delete existing questions and their options (cascade will handle options)
      await tx.quizQuestion.deleteMany({
        where: { quizId: quizId },
      });

      // Create new questions with their options
      for (const questionData of validatedData.questions) {
        const question = await tx.quizQuestion.create({
          data: {
            quizId: quiz.id,
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

      // Return the complete updated quiz with all related data
      return tx.quiz.findUnique({
        where: { id: quiz.id },
        include: {
          level: { select: { id: true, name: true, order: true, kkm: true } },
          class: { select: { classId: true, name: true } },
          _count: {
            select: {
              questions: true,
            },
          },
        },
      });
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

// PATCH /api/admin/quiz/[id] - Update quiz metadata only (without questions)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authenticate admin
    await handleAuthAdmin(request);

    const { id } = await params;
    const quizId = parseInt(id);

    if (!quizId || isNaN(quizId)) {
      throw new ResponseError(400, 'Invalid quiz ID');
    }

    const body = await request.json();
    const validatedData = updateQuizSchema.parse(body);

    // Check if quiz exists
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id: quizId },
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

    // Update only the quiz metadata
    const updatedQuiz = await prisma.quiz.update({
      where: { id: quizId },
      data: validatedData,
      include: {
        level: { select: { id: true, name: true, order: true, kkm: true } },
        class: { select: { classId: true, name: true } },
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Quiz metadata updated successfully',
      data: updatedQuiz,
    });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/admin/quiz/[id] - Delete quiz by ID
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Authenticate admin
    await handleAuthAdmin(request);

    const { id } = await params;
    const quizId = parseInt(id);

    if (!quizId || isNaN(quizId)) {
      throw new ResponseError(400, 'Invalid quiz ID');
    }

    // Check if quiz exists
    const existingQuiz = await prisma.quiz.findUnique({
      where: { id: quizId },
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
      where: { id: quizId },
    });

    return NextResponse.json({
      success: true,
      message: 'Quiz deleted successfully',
    });
  } catch (error) {
    return handleError(error);
  }
}

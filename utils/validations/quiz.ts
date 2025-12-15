import { z } from 'zod';

// Quiz Option Schema
export const quizOptionSchema = z.object({
  id: z.number().optional(), // For updates
  option: z.string().min(1, 'Option text is required').max(500, 'Option text is too long'),
  isCorrect: z.boolean().default(false),
});

// Quiz Question Schema with options validation
export const quizQuestionSchema = z.object({
  id: z.number().optional(), // For updates
  question: z.string().min(1, 'Question text is required').max(1000, 'Question text is too long'),
  options: z
    .array(quizOptionSchema)
    .min(2, 'Each question must have at least 2 options')
    .max(6, 'Each question can have maximum 6 options')
    .refine(
      (options) => {
        const correctOptions = options.filter((option) => option.isCorrect === true);
        return correctOptions.length === 1;
      },
      {
        message: 'Each question must have exactly one correct option',
      }
    )
    .refine(
      (options) => {
        const uniqueOptions = new Set(options.map((option) => option.option.trim().toLowerCase()));
        return uniqueOptions.size === options.length;
      },
      {
        message: 'All options must be unique within a question',
      }
    ),
});

// Quiz Schema
export const quizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required').max(200, 'Quiz title is too long'),
  description: z.string().max(1000, 'Quiz description is too long').optional(),
  levelId: z.number().int().positive('Level ID must be a positive integer'),
  classId: z.number().int().positive('Class ID must be a positive integer'),
  duration: z.number().int().min(1, 'Duration must be at least 1 minute').max(300, 'Duration cannot exceed 5 hours'),
  questions: z.array(quizQuestionSchema).min(1, 'Quiz must have at least 1 question').max(50, 'Quiz can have maximum 50 questions'),
});

// Create Quiz Schema (without IDs)
export const createQuizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required').max(200, 'Quiz title is too long'),
  description: z.string().max(1000, 'Quiz description is too long').optional(),
  levelId: z.number().int().positive('Level ID must be a positive integer'),
  classId: z.number().int().positive('Class ID must be a positive integer'),
  duration: z.number().int().min(1, 'Duration must be at least 1 minute').max(300, 'Duration cannot exceed 5 hours'),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  questions: z
    .array(
      z.object({
        question: z.string().min(1, 'Question text is required').max(1000, 'Question text is too long'),
        options: z
          .array(
            z.object({
              option: z.string().min(1, 'Option text is required').max(500, 'Option text is too long'),
              isCorrect: z.boolean().default(false),
            })
          )
          .min(2, 'Each question must have at least 2 options')
          .max(6, 'Each question can have maximum 6 options')
          .refine(
            (options) => {
              const correctOptions = options.filter((option) => option.isCorrect === true);
              return correctOptions.length === 1;
            },
            {
              message: 'Each question must have exactly one correct option',
            }
          )
          .refine(
            (options) => {
              const uniqueOptions = new Set(options.map((option) => option.option.trim().toLowerCase()));
              return uniqueOptions.size === options.length;
            },
            {
              message: 'All options must be unique within a question',
            }
          ),
      })
    )
    .min(1, 'Quiz must have at least 1 question')
    .max(50, 'Quiz can have maximum 50 questions'),
});

// Update Quiz Schema (partial updates allowed)
export const updateQuizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required').max(200, 'Quiz title is too long').optional(),
  description: z.string().max(1000, 'Quiz description is too long').optional(),
  levelId: z.number().int().positive('Level ID must be a positive integer').optional(),
  classId: z.number().int().positive('Class ID must be a positive integer').optional(),
  duration: z.number().int().min(1, 'Duration must be at least 1 minute').max(300, 'Duration cannot exceed 5 hours').optional(),
});

// Individual Question Schema for separate CRUD operations
export const createQuestionSchema = z.object({
  quizId: z.number().int().positive('Quiz ID must be a positive integer'),
  question: z.string().min(1, 'Question text is required').max(1000, 'Question text is too long'),
  options: z
    .array(
      z.object({
        option: z.string().min(1, 'Option text is required').max(500, 'Option text is too long'),
        isCorrect: z.boolean().default(false),
      })
    )
    .min(2, 'Each question must have at least 2 options')
    .max(6, 'Each question can have maximum 6 options')
    .refine(
      (options) => {
        const correctOptions = options.filter((option) => option.isCorrect === true);
        return correctOptions.length === 1;
      },
      {
        message: 'Each question must have exactly one correct option',
      }
    )
    .refine(
      (options) => {
        const uniqueOptions = new Set(options.map((option) => option.option.trim().toLowerCase()));
        return uniqueOptions.size === options.length;
      },
      {
        message: 'All options must be unique within a question',
      }
    ),
});

// Update Question Schema
export const updateQuestionSchema = z.object({
  question: z.string().min(1, 'Question text is required').max(1000, 'Question text is too long').optional(),
});

// Individual Option Schema for separate CRUD operations
export const createOptionSchema = z.object({
  questionId: z.number().int().positive('Question ID must be a positive integer'),
  option: z.string().min(1, 'Option text is required').max(500, 'Option text is too long'),
  isCorrect: z.boolean().default(false),
});

export const updateOptionSchema = z.object({
  option: z.string().min(1, 'Option text is required').max(500, 'Option text is too long').optional(),
  isCorrect: z.boolean().optional(),
});

// Query Schemas for filtering
export const quizQuerySchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val) || 1)
    .pipe(z.number().min(1)),
  limit: z
    .string()
    .transform((val) => parseInt(val) || 10)
    .pipe(z.number().min(1).max(100)),
  levelId: z
    .string()
    .transform((val) => parseInt(val) || undefined)
    .pipe(z.number().positive())
    .optional(),
  classId: z
    .string()
    .transform((val) => parseInt(val) || undefined)
    .pipe(z.number().positive())
    .optional(),
  search: z.string().optional(),
});

// Type exports for TypeScript
export type Quiz = z.infer<typeof quizSchema>;
export type CreateQuiz = z.infer<typeof createQuizSchema>;
export type UpdateQuiz = z.infer<typeof updateQuizSchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type CreateQuestion = z.infer<typeof createQuestionSchema>;
export type UpdateQuestion = z.infer<typeof updateQuestionSchema>;
export type QuizOption = z.infer<typeof quizOptionSchema>;
export type CreateOption = z.infer<typeof createOptionSchema>;
export type UpdateOption = z.infer<typeof updateOptionSchema>;
export type QuizQuery = z.infer<typeof quizQuerySchema>;

/**
 * Error Handler Utility
 *
 * Central error handling function untuk semua API routes.
 * Menangani berbagai tipe error dan mengembalikan response yang konsisten.
 *
 * Error Types Handled:
 * - ResponseError: Custom error dengan status dan message
 * - ZodError: Validation errors dari Zod schema
 * - Unknown errors: Fallback untuk unexpected errors
 *
 * Response Format:
 * - success: boolean (always false for errors)
 * - message: string (user-friendly error message)
 * - errors: array (detailed error information)
 *
 * Status Codes:
 * - ResponseError: Uses custom status code
 * - ZodError: 400 (Bad Request)
 * - Unknown: 500 (Internal Server Error)
 *
 * Usage:
 * Import dan gunakan di catch blocks pada semua API routes
 * untuk consistent error handling dan response format.
 */

import ResponseError from './ResponseError';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

const handleError = (error: unknown) => {
  if (error instanceof ResponseError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        errors: [{ message: error.message }],
      },
      {
        status: error.status,
      }
    );
  } else if (error instanceof ZodError) {
    const errorIssues = error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    return NextResponse.json(
      {
        success: false,
        message: errorIssues[0].path + ' ' + errorIssues[0].message || 'Validation error',
        errors: errorIssues,
      },
      {
        status: 400,
      }
    );
  }
  console.error('Unhandled Error:', error);

  return NextResponse.json(
    {
      success: false,
      message: 'Internal server error',
    },
    { status: 500 }
  );
};

export default handleError;

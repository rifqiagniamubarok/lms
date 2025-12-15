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

/**
 * Custom Response Error Class
 *
 * Custom error class yang extends Error untuk menangani API errors
 * dengan HTTP status codes yang spesifik.
 *
 * Features:
 * - Custom HTTP status code property
 * - Error message inheritance dari Error class
 * - Name property untuk error type identification
 *
 * Usage:
 * throw new ResponseError(404, 'User not found');
 * throw new ResponseError(400, 'Invalid input data');
 * throw new ResponseError(401, 'Unauthorized access');
 *
 * Integration:
 * - Digunakan dengan handleError utility untuk consistent error responses
 * - Dapat di-catch dan di-handle dengan proper HTTP status codes
 * - Memudahkan debugging dengan clear error messages
 */

class ResponseError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ResponseError';
  }
}

export default ResponseError;

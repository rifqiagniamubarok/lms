import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.AUTH_SECRET || 'your-secret-key-change-in-production';

/**
 * Hash a password using bcrypt
 * @param password - Plain text password to hash
 * @returns Promise with hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
}

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password to compare against
 * @returns Promise with boolean indicating if passwords match
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

/**
 * Generate a JWT token for password reset
 * @param data - Data to encode in the token (e.g., user email or id)
 * @param expiresIn - Token expiration time (default: '1h' for 1 hour)
 * @returns JWT token string
 */
export function generateToken(data: Record<string, unknown>, expiresIn = '1h'): string {
  const token = jwt.sign(data, JWT_SECRET, { expiresIn } as jwt.SignOptions);
  return token;
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @returns Decoded token data or null if invalid
 */
export function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as Record<string, unknown>;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

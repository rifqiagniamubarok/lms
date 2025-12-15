import { auth } from '@/auth';
import { verifyToken } from './encryption';
import ResponseError from './ResponseError';

export const handleAuth = async (req: Request) => {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    throw new ResponseError(401, 'Invalid or expired token');
  }

  const token = auth.split(' ')[1];

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    throw new ResponseError(401, 'Invalid or expired token');
  }

  return decodedToken;
};

export const handleAuthAdmin = async (req: Request) => {
  const session = await auth();

  if (!session?.user) {
    throw new ResponseError(401, 'Invalid or expired token');
  }

  return session.user;
};

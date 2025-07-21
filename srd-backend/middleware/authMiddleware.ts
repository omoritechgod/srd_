// middleware/authMiddleware.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../utils/auth';

export const authMiddleware = (handler: Function) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication token missing or invalid.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    // Attach decoded user info to request if needed (e.g., req.user = decoded;)
    return handler(req, res);
  };
};
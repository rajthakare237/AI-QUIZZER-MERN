import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const requireAuth = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  req.user = jwt.verify(token, process.env.JWT_SECRET!);
  next();
};

// src/middlewares/rateLimit.middleware.ts
import rateLimit from 'express-rate-limit';

export const quizLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5
});

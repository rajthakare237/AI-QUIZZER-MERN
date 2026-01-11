import { Router } from 'express';
import type { Request, Response } from 'express';
import { Quiz } from '../models/Quiz.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { Attempt } from "../models/Attempt.js";

// 1. Define custom interface for Authenticated Requests
interface AuthRequest extends Request {
  user?: {
    id: string;
    [key: string]: any;
  };
}

const r = Router();

r.get(
  '/quizzes',
  requireAuth,
  // Cast req to AuthRequest
  async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const quizzes = await Quiz.find({ createdBy: authReq.user!.id });
    res.json(quizzes);
  }
);

r.get("/stats", requireAuth, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest; // Cast req
  const userId = authReq.user!.id;

  const quizzesCount = await Quiz.countDocuments({
    createdBy: userId
  });

  const attempts = await Attempt.find({ user: userId });

  const attemptsCount = attempts.length;

  const averageScore =
    attemptsCount === 0
      ? 0
      : Math.round(
          attempts.reduce((sum, a) => {
            // 2. Fix 'possibly null' error by defaulting to 0
            const percentage = a.percentage ?? 0; 
            return sum + percentage;
          }, 0) / attemptsCount
        );

  res.json({
    quizzes: quizzesCount,
    attempts: attemptsCount,
    averageScore
  });
});

export default r;





// import { Router } from 'express';
// import type { Request, Response } from 'express';
// import { Quiz } from '../models/Quiz.js';
// import { requireAuth } from '../middlewares/auth.middleware.js';
// import { Attempt } from "../models/Attempt.js";

// const r = Router();

// r.get(
//   '/quizzes',
//   requireAuth,
//   async (req: Request & { user?: any }, res: Response) => {
//     const quizzes = await Quiz.find({ createdBy: req.user.id });
//     res.json(quizzes);
//   }
// );

// r.get("/stats", requireAuth, async (req, res) => {
//   const userId = req.user!.id;

//   const quizzesCount = await Quiz.countDocuments({
//     createdBy: userId
//   });

//   const attempts = await Attempt.find({ user: userId });

//   const attemptsCount = attempts.length;

//   const averageScore =
//     attemptsCount === 0
//       ? 0
//       : Math.round(
//           attempts.reduce((sum, a) => sum + a.percentage, 0) /
//             attemptsCount
//         );

//   res.json({
//     quizzes: quizzesCount,
//     attempts: attemptsCount,
//     averageScore
//   });
// });

// export default r;

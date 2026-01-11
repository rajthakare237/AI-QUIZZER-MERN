import { Router } from 'express';
import type { Request, Response } from 'express';
import { Attempt } from '../models/Attempt.js';
import { Quiz } from '../models/Quiz.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post(
  '/:id/attempt',
  requireAuth,
  async (req: Request & { user?: any }, res: Response) => {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.sendStatus(404);

    let score = 0;

    req.body.answers.forEach(
      (a: { questionId: string; selectedIndex: number }) => {
        const q = quiz.questions.find(
          (q: any) => q.id === a.questionId
        );
        if (q && q.correctIndex === a.selectedIndex) score++;
      }
    );

    // ✅ FIX: Renamed 'userId' to 'user' and cast to 'any' to allow extra fields
    const attempt = await Attempt.create({
      user: req.user.id, // Fixed: Property name matched to Schema
      quizId: quiz._id,
      answers: req.body.answers,
      score,
      topic: quiz.topic, // Recommended: Likely required for Dashboard
      total: quiz.questions.length // Recommended: Likely required for Dashboard
    } as any);

    res.json({ score, attempt });
  }
);

export default router;







// import { Router } from 'express';
// import type { Request, Response } from 'express';
// import { Attempt } from '../models/Attempt.js';
// import { Quiz } from '../models/Quiz.js';
// import { requireAuth } from '../middlewares/auth.middleware.js';

// const router = Router();

// router.post(
//   '/:id/attempt',
//   requireAuth,
//   async (req: Request & { user?: any }, res: Response) => {
//     const quiz = await Quiz.findById(req.params.id);
//     if (!quiz) return res.sendStatus(404);

//     let score = 0;

//     req.body.answers.forEach(
//       (a: { questionId: string; selectedIndex: number }) => {
//         const q = quiz.questions.find(
//           (q: any) => q.id === a.questionId
//         );
//         if (q && q.correctIndex === a.selectedIndex) score++;
//       }
//     );

//     const attempt = await Attempt.create({
//       userId: req.user.id,
//       quizId: quiz._id,
//       answers: req.body.answers,
//       score
//     });

//     res.json({ score, attempt });
//   }
// );

// export default router;

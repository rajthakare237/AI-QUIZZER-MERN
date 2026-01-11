// ✅ FIX 1: Use 'type' import for Request/Response
import { Router } from 'express';
import type { Request, Response } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { quizLimiter } from '../middlewares/rateLimit.middleware.js';
import { generateQuizViaOpenAI } from '../services/openai.service.js';
import { Quiz } from '../models/Quiz.js';
import { Attempt } from '../models/Attempt.js';
import crypto from "crypto";

// 1. Define a custom interface for Authenticated Requests
interface AuthRequest extends Request {
  user?: {
    id: string;
    [key: string]: any;
  };
}

const r = Router();

// Note: We cast 'req' to 'AuthRequest' in the callbacks below

r.post('/generate', requireAuth, quizLimiter, async (req: Request, res: Response) => {
  try {
    const { topic, noOfQuestions, difficulty } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (noOfQuestions > 50) {
      return res.status(400).json({ error: 'Max 50 questions allowed' });
    }

    const quiz = await generateQuizViaOpenAI(
      topic,
      noOfQuestions,
      difficulty
    );

    res.json({ quiz });
  } catch (err) {
    console.error('Quiz generation failed:', err);
    res.status(500).json({ error: 'Quiz generation failed' });
  }
});

r.get('/public/:id', async (req: Request, res: Response) => {
  const quiz = await Quiz.findById(req.params.id);
  res.json(quiz);
});

/* Save Quiz */
r.post("/save", requireAuth, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest; // Cast to AuthRequest
  const { quiz, topic, difficulty } = req.body;

  if (!quiz || !topic || !difficulty) {
    return res.status(400).json({
      error: "Missing quiz, topic or difficulty"
    });
  }

  const savedQuiz = await Quiz.create({
    topic,
    difficulty,
    questions: quiz.questions,
    createdBy: authReq.user!.id
  });

  res.json(savedQuiz);
});

/* Save Attempt */
r.post('/attempt', requireAuth, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const { topic, score, total } = req.body;

  const attempt = await Attempt.create({
    user: authReq.user!.id,
    topic,
    score,
    total,
    percentage: Math.round((score / total) * 100)
  });

  res.json(attempt);
});

/* Get Saved Quizzes */
r.get('/saved', requireAuth, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const quizzes = await Quiz.find({ createdBy: authReq.user!.id });

  const attempts = await Attempt.find({ user: authReq.user!.id });

  const result = quizzes.map(q => {
    const lastAttempt = attempts
      .filter(a => a.topic === q.topic)
      .sort((a, b) => +b.createdAt - +a.createdAt)[0];

    return {
      _id: q._id,
      topic: q.topic,
      difficulty: q.difficulty,
      questionsCount: q.questions.length,
      lastScore: lastAttempt ? lastAttempt.percentage : null
    };
  });

  res.json(result);
});

/* Get Attempts */
r.get('/attempts', requireAuth, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const attempts = await Attempt.find({ user: authReq.user!.id })
    .sort({ createdAt: -1 });

  const formatted = attempts.map(a => ({
    _id: a._id,
    topic: a.topic,
    score: a.score,
    total: a.total,
    createdAt: a.createdAt
  }));

  res.json(formatted);
});

r.get('/:id', requireAuth, async (req: Request, res: Response) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  res.json(quiz);
});

/* Delete Saved Quiz */
r.delete("/:id", requireAuth, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const quiz = await Quiz.findOneAndDelete({
    _id: req.params.id,
    createdBy: authReq.user!.id
  });

  if (!quiz) {
    return res.status(404).json({ error: "Quiz not found" });
  }

  res.json({ success: true });
});

/* Delete Attempt */
r.delete("/attempt/:id", requireAuth, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const attempt = await Attempt.findOneAndDelete({
    _id: req.params.id,
    user: authReq.user!.id
  });

  if (!attempt) {
    return res.status(404).json({ error: "Attempt not found" });
  }

  res.json({ success: true });
});

r.post("/:id/share", requireAuth, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const quiz = await Quiz.findOne({
    _id: req.params.id,
    createdBy: authReq.user!.id
  });

  if (!quiz) {
    return res.status(404).json({ error: "Quiz not found" });
  }

  if (!quiz.shareToken) {
    quiz.shareToken = crypto.randomBytes(16).toString("hex");
    await quiz.save();
  }

  res.json({
    shareUrl: `${process.env.FRONTEND_URL}/quiz/shared/${quiz.shareToken}`
  });
});

r.get("/shared/:token", async (req: Request, res: Response) => {
  // ✅ FIX 2: Cast token to string to guarantee it is not undefined
  const quiz = await Quiz.findOne({ shareToken: req.params.token as string });

  if (!quiz) {
    return res.status(404).json({ error: "Invalid or expired link" });
  }

  res.json({
    _id: quiz._id,
    topic: quiz.topic,
    difficulty: quiz.difficulty,
    questions: quiz.questions
  });
});

export default r;






// import { Router } from 'express';
// import { requireAuth } from '../middlewares/auth.middleware.js';
// import { quizLimiter } from '../middlewares/rateLimit.middleware.js';
// import { generateQuizViaOpenAI } from '../services/openai.service.js';
// import { Quiz } from '../models/Quiz.js';
// import { Attempt } from '../models/Attempt.js';
// import crypto from "crypto";


// const r = Router();

// r.post('/generate', requireAuth, quizLimiter, async (req, res) => {
//   try {
//     const { topic, noOfQuestions, difficulty } = req.body;

//     if (!topic) {
//       return res.status(400).json({ error: 'Topic is required' });
//     }

//     if (noOfQuestions > 50) {
//       return res.status(400).json({ error: 'Max 50 questions allowed' });
//     }

//     const quiz = await generateQuizViaOpenAI(
//       topic,
//       noOfQuestions,
//       difficulty
//     );

//     res.json({ quiz });
//   } catch (err) {
//     console.error('Quiz generation failed:', err);
//     res.status(500).json({ error: 'Quiz generation failed' });
//   }
// });

// r.get('/public/:id', async (req, res) => {
//   const quiz = await Quiz.findById(req.params.id);
//   res.json(quiz);
// });

// /* Save Quiz */
// r.post("/save", requireAuth, async (req, res) => {
//   const { quiz, topic, difficulty } = req.body;

//   if (!quiz || !topic || !difficulty) {
//     return res.status(400).json({
//       error: "Missing quiz, topic or difficulty"
//     });
//   }

//   const savedQuiz = await Quiz.create({
//     topic,
//     difficulty,
//     questions: quiz.questions,
//     createdBy: req.user!.id
//   });

//   res.json(savedQuiz);
// });




// /* Save Attempt */
// r.post('/attempt', requireAuth, async (req, res) => {
//   const { topic, score, total } = req.body;

//   const attempt = await Attempt.create({
//     user: req.user!.id,
//     topic,
//     score,
//     total,
//     percentage: Math.round((score / total) * 100)
//   });

//   res.json(attempt);
// });

// /* Get Saved Quizzes */
// r.get('/saved', requireAuth, async (req, res) => {
//   const quizzes = await Quiz.find({ createdBy: req.user!.id });

//   const attempts = await Attempt.find({ user: req.user!.id });

//   const result = quizzes.map(q => {
//     const lastAttempt = attempts
//       .filter(a => a.topic === q.topic)
//       .sort((a, b) => +b.createdAt - +a.createdAt)[0];

//     return {
//       _id: q._id,
//       topic: q.topic,
//       difficulty: q.difficulty,
//       questionsCount: q.questions.length,
//       lastScore: lastAttempt ? lastAttempt.percentage : null
//     };
//   });

//   res.json(result);
// });



// /* Get Attempts */
// r.get('/attempts', requireAuth, async (req, res) => {
//   const attempts = await Attempt.find({ user: req.user!.id })
//     .sort({ createdAt: -1 });

//   const formatted = attempts.map(a => ({
//     _id: a._id,                // ✅ FIX
//     topic: a.topic,
//     score: a.score,
//     total: a.total,
//     createdAt: a.createdAt     // ✅ send raw date
//   }));

//   res.json(formatted);
// });


// r.get('/:id', requireAuth, async (req, res) => {
//   const quiz = await Quiz.findById(req.params.id);
//   if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
//   res.json(quiz);
// });

// /* Delete Saved Quiz */
// r.delete("/:id", requireAuth, async (req, res) => {
//   const quiz = await Quiz.findOneAndDelete({
//     _id: req.params.id,
//     createdBy: req.user!.id
//   });

//   if (!quiz) {
//     return res.status(404).json({ error: "Quiz not found" });
//   }

//   res.json({ success: true });
// });

// /* Delete Attempt */
// r.delete("/attempt/:id", requireAuth, async (req, res) => {
//   const attempt = await Attempt.findOneAndDelete({
//     _id: req.params.id,
//     user: req.user!.id
//   });

//   if (!attempt) {
//     return res.status(404).json({ error: "Attempt not found" });
//   }

//   res.json({ success: true });
// });


// r.post("/:id/share", requireAuth, async (req, res) => {
//   const quiz = await Quiz.findOne({
//     _id: req.params.id,
//     createdBy: req.user!.id
//   });

//   if (!quiz) {
//     return res.status(404).json({ error: "Quiz not found" });
//   }

//   if (!quiz.shareToken) {
//     quiz.shareToken = crypto.randomBytes(16).toString("hex");
//     await quiz.save();
//   }

//   res.json({
//     shareUrl: `${process.env.FRONTEND_URL}/quiz/shared/${quiz.shareToken}`
//   });
// });

// r.get("/shared/:token", async (req, res) => {
//   const quiz = await Quiz.findOne({ shareToken: req.params.token });

//   if (!quiz) {
//     return res.status(404).json({ error: "Invalid or expired link" });
//   }

//   res.json({
//     _id: quiz._id,
//     topic: quiz.topic,
//     difficulty: quiz.difficulty,
//     questions: quiz.questions
//   });
// });


// export default r;

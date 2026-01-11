import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import attemptRoutes from './routes/attempt.routes.js';
import userRoutes from './routes/user.routes.js';
import profileRoutes from './routes/profile.routes.js'


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/user', userRoutes);
app.use('/api/users', profileRoutes);


mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server running on ${process.env.PORT}`)
    );
  });

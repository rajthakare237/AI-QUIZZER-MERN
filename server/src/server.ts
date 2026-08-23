import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns'; // 1. Import Node's native DNS module

import authRoutes from './routes/auth.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import attemptRoutes from './routes/attempt.routes.js';
import userRoutes from './routes/user.routes.js';
import profileRoutes from './routes/profile.routes.js';

// 2. Force this specific Node.js process to use Google's DNS
// This completely bypasses your Jio/Airtel/ISP network block in code.
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/user', userRoutes);
app.use('/api/users', profileRoutes);

mongoose.connect(process.env.MONGO_URI!, {
  family: 4, 
})
  .then(() => {
    const PORT = process.env.PORT || 5000; 
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
  });
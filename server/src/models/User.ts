import { Schema, model } from 'mongoose';

export const User = model('User', new Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  avatarId: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
    max: 8
  },
  savedQuizzes: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
  createdAt: { type: Date, default: Date.now }
}));

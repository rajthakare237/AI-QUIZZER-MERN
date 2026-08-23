import { Schema, model } from 'mongoose';

export const Attempt = model(
  'Attempt',
  new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    topic: String,
    score: Number,
    total: Number,
    percentage: Number,
    createdAt: { type: Date, default: Date.now }
  })
);

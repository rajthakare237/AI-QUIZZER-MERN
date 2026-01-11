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


// import { Schema, model } from 'mongoose';

// export const Attempt = model('Attempt', new Schema({
//   userId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
//   quizId: { type: Schema.Types.ObjectId, ref: 'Quiz' },
//   answers: Array,
//   score: Number,
//   createdAt: { type: Date, default: Date.now }
// }));

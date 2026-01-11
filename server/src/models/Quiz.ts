import { Schema, model } from "mongoose";

const QuestionSchema = new Schema({
  question: { type: String, required: true },
  options: {
    type: [String],
    // ✅ FIX: Explicitly type 'v' as string[]
    validate: (v: string[]) => v.length === 4
  },
  correctIndex: { type: Number, min: 0, max: 3 }
});

const QuizSchema = new Schema({
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  questions: {
    type: [QuestionSchema],
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  shareToken: {
    type: String,
    default: null,
    index: true
  },
  createdAt: { type: Date, default: Date.now }
});

export const Quiz = model("Quiz", QuizSchema);




// import { Schema, model } from "mongoose";

// const QuestionSchema = new Schema({
//   question: { type: String, required: true },
//   options: {
//     type: [String],
//     validate: v => v.length === 4
//   },
//   correctIndex: { type: Number, min: 0, max: 3 }
// });

// const QuizSchema = new Schema({
//   topic: { type: String, required: true },
//   difficulty: { type: String, required: true },
//   questions: {
//     type: [QuestionSchema],
//     required: true
//   },
//   createdBy: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//     required: true
//   },
//   shareToken: {
//     type: String,
//     default: null,
//     index: true
//   },
//   createdAt: { type: Date, default: Date.now }
// });

// export const Quiz = model("Quiz", QuizSchema);

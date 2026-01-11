type Question = {
  question: string;
  options: string[];
  correctIndex: number;
};

type Quiz = {
  questions: Question[];
};

export function validateQuiz(q: Quiz) {
  if (!q?.questions?.length) {
    throw new Error('Invalid quiz: no questions');
  }

  q.questions.forEach((x, i) => {
    if (!x.question) {
      throw new Error(`Question ${i + 1} has no text`);
    }

    if (!Array.isArray(x.options) || x.options.length !== 4) {
      throw new Error(`Question ${i + 1} must have exactly 4 options`);
    }

    if (x.correctIndex < 0 || x.correctIndex > 3) {
      throw new Error(`Invalid correctIndex in question ${i + 1}`);
    }
  });
}



// type Question = { options: any[]; correctIndex: number };

// export function validateQuiz(q: any) {
//   if (!q?.questions?.length) throw new Error('Invalid quiz');

//   q.questions.forEach((x: Question) => {
//     if (x.options.length !== 4) throw new Error('Options must be 4');
//     if (x.correctIndex < 0 || x.correctIndex > 3)
//       throw new Error('Invalid correctIndex');
//   });
// }

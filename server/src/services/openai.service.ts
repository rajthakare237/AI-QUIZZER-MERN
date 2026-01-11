import OpenAI from 'openai';
import { cache } from '../utils/cache.js';
import { validateQuiz } from '../utils/validateQuiz.js';

type Question = {
  question: string;
  options: string[];
  correctIndex: number;
};

type Quiz = {
  questions: Question[];
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string
});

export async function generateQuizViaOpenAI(
  topic: string,
  no: number,
  difficulty: 'easy' | 'medium' | 'hard'
): Promise<Quiz> {
  const key = `${topic}-${no}-${difficulty}`;
  if (cache.has(key)) return cache.get(key) as Quiz;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'You are a quiz generator. Return ONLY valid JSON.'
      },
      {
        role: 'user',
        content: `
Generate ${no} MCQs on "${topic}" (${difficulty})

Schema:
{
  "questions": [
    {
      "question": string,
      "options": [string, string, string, string],
      "correctIndex": number
    }
  ]
}
`
      }
    ],
    temperature: 0.3
  });

  const message = res.choices?.[0]?.message?.content;
  if (!message) {
    throw new Error('OpenAI returned empty response');
  }

  // ✅ THIS WAS THE MISSING LINE
  const quiz = JSON.parse(message) as Quiz;

  validateQuiz(quiz);

  cache.set(key, quiz);
  return quiz;
}





// import OpenAI from 'openai';
// import { cache } from '../utils/cache.js';
// import { validateQuiz } from '../utils/validateQuiz.js';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY as string
// });

// export async function generateQuizViaOpenAI(
//   topic: string,
//   no: number,
//   difficulty: 'easy' | 'medium' | 'hard'
// ) {
//   const key = `${topic}-${no}-${difficulty}`;
//   if (cache.has(key)) return cache.get(key);

//   const res = await openai.chat.completions.create({
//     model: 'gpt-4o-mini',
//     messages: [
//       { role: 'system', content: 'You output JSON only.' },
//       {
//         role: 'user',
//         content: `Generate ${no} MCQs on ${topic} (${difficulty}) using provided schema.`
//       }
//     ],
//     temperature: 0.3
//   });

//   const content = res.choices[0]?.message?.content;
//   if (!content) throw new Error('Empty OpenAI response');

//   const quiz = JSON.parse(content);
//   validateQuiz(quiz);

//   cache.set(key, quiz);
//   return quiz;
// }

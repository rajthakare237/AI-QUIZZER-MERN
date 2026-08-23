import { GoogleGenAI } from '@google/genai';
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

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string
});

export async function generateQuizViaGemini(
  topic: string,
  no: number,
  difficulty: 'easy' | 'medium' | 'hard'
): Promise<Quiz> {
  const key = `${topic}-${no}-${difficulty}`;
  if (cache.has(key)) return cache.get(key) as Quiz;

  const prompt = `
Generate ${no} MCQs on "${topic}" (${difficulty})

Schema:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0
    }
  ]
}
`;

  // Call Gemini using the recommended Flash model
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      // systemInstruction replaces OpenAI's 'system' role
      systemInstruction: 'You are a quiz generator. Return ONLY valid JSON.',
      // Forces Gemini to output parseable JSON
      responseMimeType: 'application/json',
      temperature: 0.3
    }
  });

  const message = response.text;
  if (!message) {
    throw new Error('Gemini returned empty response');
  }

  const quiz = JSON.parse(message) as Quiz;

  validateQuiz(quiz);

  cache.set(key, quiz);
  return quiz;
}

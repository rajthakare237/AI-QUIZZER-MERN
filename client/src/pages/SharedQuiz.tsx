// pages/SharedQuiz.tsx
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetSharedQuizQuery } from "../app/api";

export default function SharedQuiz() {
  const { token } = useParams();
  const navigate = useNavigate();

  const { data: quiz, isLoading, error } =
    useGetSharedQuizQuery(token!);

  useEffect(() => {
    if (quiz) {
      navigate("/quiz/play", {
        state: {
          quiz: { questions: quiz.questions },
          topic: quiz.topic,
          difficulty: quiz.difficulty
        },
        replace: true
      });
    }
  }, [quiz, navigate]);

  if (isLoading) return <p>Loading quiz...</p>;
  if (error) return <p>Invalid or expired quiz link</p>;

  return null;
}

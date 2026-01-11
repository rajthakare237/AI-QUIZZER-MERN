import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetQuizByIdQuery } from "../app/api";
import styles from "../styles/QuizPlayer.module.scss"; // Reusing container style

export default function RetryQuiz() {
  const location = useLocation();
  const navigate = useNavigate();

  const quizId: string | undefined = location.state?.quizId;

  const { data: quiz } = useGetQuizByIdQuery(quizId!, {
    skip: !quizId
  });

  useEffect(() => {
    if (quiz) {
      navigate("/quiz/play", {
        replace: true, // Replace history so back button doesn't loop
        state: {
          quiz: {
            questions: quiz.questions
          },
          topic: quiz.topic,
          difficulty: quiz.difficulty
        }
      });
    }
  }, [quiz, navigate]);

  if (!quizId) {
    return (
      <div className={styles.container}>
        <h2>Error: Invalid Quiz ID</h2>
        <button className={styles.submitBtn} onClick={() => navigate("/dashboard")}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  // A simple Loading UI
  return (
    <div className={styles.container} style={{ justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#6366f1' }}>Preparing Quiz...</h2>
        <p style={{ color: '#94a3b8' }}>Shuffling questions for a fresh attempt.</p>
      </div>
    </div>
  );
}




// import { useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useGetQuizByIdQuery } from "../app/api";

// export default function RetryQuiz() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const quizId: string | undefined = location.state?.quizId;

//   const { data: quiz, isLoading } = useGetQuizByIdQuery(quizId!, {
//     skip: !quizId
//   });

//   useEffect(() => {
//     if (quiz) {
//       navigate("/quiz/play", {
//         state: {
//           quiz: {
//             questions: quiz.questions // ✅ keep same shape
//           },
//           topic: quiz.topic,
//           difficulty: quiz.difficulty // ✅ REQUIRED
//         }
//       });
//     }
//   }, [quiz, navigate]);

//   if (!quizId) return <div>Invalid quiz</div>;
//   if (isLoading) return <div>Loading quiz...</div>;

//   return null;
// }


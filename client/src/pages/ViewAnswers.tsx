import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/QuizPlayer.module.scss";
import { useAppSelector } from "../app/hooks";

type Question = {
  question: string;
  options: string[];
  correctIndex: number;
};

type Answer = {
  questionIndex: number;
  selectedIndex: number;
};

export default function ViewAnswers() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const quiz = location.state?.quiz;
  const answers: Answer[] = location.state?.answers ?? [];

  if (!quiz) {
    return (
      <div className={styles.container}>
        <h2>No answers found</h2>
        <button
          className={styles.submitBtn}
          onClick={() => navigate("/dashboard")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 1. Consistent Close Button */}
      <button
        className={styles.closeBtn}
        onClick={() => navigate("/dashboard")}
        title="Close"
      >
        ✕
      </button>

      {/* 2. Consistent Header */}
      <div className={styles.header}>
        <h1>Review Answers</h1>
      </div>

      {/* Questions List */}
      {quiz.questions.map((q: Question, qIndex: number) => {
        const userAnswer = answers.find(
          (a) => a.questionIndex === qIndex
        )?.selectedIndex;

        return (
          <div key={qIndex} className={styles.card}>
            <h2 className={styles.questionText}>
              {qIndex + 1}. {q.question}
            </h2>

            <div className={styles.options}>
              {q.options.map((opt, idx) => {
                let className = styles.option;

                if (idx === q.correctIndex) {
                  className += ` ${styles.correct}`;
                }

                if (idx === userAnswer && idx !== q.correctIndex) {
                  className += ` ${styles.wrong}`;
                }

                // If user didn't answer and this is neither correct nor wrong,
                // we keep base style.
                // (Optional: You could highlight the user's choice even if it's normal style
                // but usually correct/wrong is enough).
                if (idx === userAnswer && idx === q.correctIndex) {
                  // It already has .correct, but we ensure it looks selected too
                  className += ` ${styles.selected}`;
                }

                return (
                  <div key={idx} className={className}>
                    {opt}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* 3. Footer for the Back Button */}
      {isAuthenticated ? (
        <div className={styles.footer}>
          <button
            className={styles.submitBtn}
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        <div className={styles.footer}>
          <button className={styles.submitBtn} onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}

// import { useLocation, useNavigate } from "react-router-dom";
// import styles from "../styles/QuizPlayer.module.scss";

// type Question = {
//   question: string;
//   options: string[];
//   correctIndex: number;
// };

// type Answer = {
//   questionIndex: number;
//   selectedIndex: number;
// };

// export default function ViewAnswers() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const quiz = location.state?.quiz;
//   const answers: Answer[] = location.state?.answers ?? [];

//   if (!quiz) {
//     return (
//       <div className={styles.container}>
//         <h2>No answers found</h2>
//         <button onClick={() => navigate("/dashboard")}>
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       <h1>Review Answers</h1>

//       {quiz.questions.map((q: Question, qIndex: number) => {
//         const userAnswer = answers.find(
//           (a) => a.questionIndex === qIndex
//         )?.selectedIndex;

//         return (
//           <div key={qIndex} className={styles.card}>
//             <h2 className={styles.questionText}>
//               {qIndex + 1}. {q.question}
//             </h2>

//             <div className={styles.options}>
//               {q.options.map((opt, idx) => {
//                 let className = styles.option;

//                 if (idx === q.correctIndex) {
//                   className += ` ${styles.correct}`;
//                 }

//                 if (
//                   idx === userAnswer &&
//                   idx !== q.correctIndex
//                 ) {
//                   className += ` ${styles.wrong}`;
//                 }

//                 return (
//                   <div key={idx} className={className}>
//                     {opt}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         );
//       })}

//       <button
//         className={styles.submitBtn}
//         onClick={() => navigate("/dashboard")}
//       >
//         Back to Dashboard
//       </button>
//     </div>
//   );
// }

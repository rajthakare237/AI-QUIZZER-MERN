import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Timer from "../components/Timer";
import Result from "./Result";
import styles from "../styles/QuizPlayer.module.scss";
import {
  useSaveAttemptMutation,
  useSaveQuizMutation
} from "../app/api";

type Question = {
  question: string;
  options: string[];
  correctIndex: number;
};

type Quiz = {
  questions: Question[];
};

type Answer = {
  questionIndex: number;
  selectedIndex: number;
};

export default function QuizPlayer() {
  const location = useLocation();
  const navigate = useNavigate();

  const quiz: Quiz | undefined = location.state?.quiz;
  const topic: string | undefined = location.state?.topic;
  const difficulty: string | undefined = location.state?.difficulty;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const [saveAttempt] = useSaveAttemptMutation();
  const [saveQuiz] = useSaveQuizMutation();

  /* 🔐 STRICT GUARD – do this ONCE */
  if (!quiz || !quiz.questions?.length || !topic || !difficulty) {
    return (
      <div className={styles.container}>
        <h2>Invalid quiz data</h2>
        <button onClick={() => navigate("/generate")}>
          Go Back
        </button>
      </div>
    );
  }

  const question = quiz.questions[currentIndex];
  const total = quiz.questions.length;

  function selectAnswer(index: number) {
    setAnswers((prev) => [
      ...prev.filter((a) => a.questionIndex !== currentIndex),
      { questionIndex: currentIndex, selectedIndex: index }
    ]);
  }

  function getSelected() {
    return answers.find(
      (a) => a.questionIndex === currentIndex
    )?.selectedIndex;
  }

  // Check if an option is selected for the current question
  const isOptionSelected = getSelected() !== undefined;

  function calculateScore() {
    let s = 0;
    answers.forEach((a) => {
      if (
        quiz!.questions[a.questionIndex].correctIndex ===
        a.selectedIndex
      ) {
        s++;
      }
    });
    return s;
  }

  function submit() {
    const finalScore = calculateScore();

    saveAttempt({
      topic: topic!,
      score: finalScore,
      total
    });

    setScore(finalScore);
    setSubmitted(true);
  }

  function retryQuiz() {
    setCurrentIndex(0);
    setAnswers([]);
    setScore(0);
    setSubmitted(false);
  }

  /* ✅ RESULT SCREEN */
  if (submitted) {
    return (
      <Result
        score={score}
        total={total}
        topic={topic}
        onRetry={retryQuiz}
        onSave={async () => {
          await saveQuiz({ quiz, topic, difficulty }).unwrap();
          navigate("/dashboard");
        }}
        onViewAnswers={() => {
          navigate("/quiz/answers", {
            state: {
              quiz,
              answers
            }
          });
        }}
      />
    );
  }

  return (
    <div className={styles.container}>
      
      {/* 2. CLOSE BUTTON */}
      <button 
        className={styles.closeBtn} 
        onClick={() => navigate(-1)}
        title="Exit Quiz"
      >
        ✕
      </button>

      {/* Header */}
      <div className={styles.header}>
        {/* 1. TOPIC DISPLAY */}
        <h1>{topic}</h1>
        <Timer seconds={total * 30} onEnd={submit} />
      </div>

      {/* Progress */}
      <div className={styles.progress}>
        Question {currentIndex + 1} of {total}
      </div>

      {/* Question */}
      <div className={styles.card}>
        <h2 className={styles.questionText}>
          {question.question}
        </h2>

        <div className={styles.options}>
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              className={`${styles.option} ${
                getSelected() === idx
                  ? styles.selected
                  : ""
              }`}
              onClick={() => selectAnswer(idx)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <button
          disabled={currentIndex === 0}
          onClick={() =>
            setCurrentIndex((i) => i - 1)
          }
        >
          ← Previous
        </button>

        {currentIndex === total - 1 ? (
          <button
            className={styles.submitBtn}
            onClick={submit}
            disabled={!isOptionSelected} // 3. Prevent Submit if not answered
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() =>
              setCurrentIndex((i) => i + 1)
            }
            disabled={!isOptionSelected} // 3. Prevent Next if not answered
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}


// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Timer from "../components/Timer";
// import Result from "./Result";
// import styles from "../styles/QuizPlayer.module.scss";
// import {
//   useSaveAttemptMutation,
//   useSaveQuizMutation
// } from "../app/api";

// type Question = {
//   question: string;
//   options: string[];
//   correctIndex: number;
// };

// type Quiz = {
//   questions: Question[];
// };

// type Answer = {
//   questionIndex: number;
//   selectedIndex: number;
// };

// export default function QuizPlayer() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const quiz: Quiz | undefined = location.state?.quiz;
//   const topic: string | undefined = location.state?.topic;
//   const difficulty: string | undefined = location.state?.difficulty;

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [answers, setAnswers] = useState<Answer[]>([]);
//   const [submitted, setSubmitted] = useState(false);
//   const [score, setScore] = useState(0);

//   const [saveAttempt] = useSaveAttemptMutation();
//   const [saveQuiz] = useSaveQuizMutation();

//   /* 🔐 STRICT GUARD – do this ONCE */
//   if (!quiz || !quiz.questions?.length || !topic || !difficulty) {
//     return (
//       <div className={styles.container}>
//         <h2>Invalid quiz data</h2>
//         <button onClick={() => navigate("/generate")}>
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   const question = quiz.questions[currentIndex];
//   const total = quiz.questions.length;

//   function selectAnswer(index: number) {
//     setAnswers((prev) => [
//       ...prev.filter((a) => a.questionIndex !== currentIndex),
//       { questionIndex: currentIndex, selectedIndex: index }
//     ]);
//   }

//   function getSelected() {
//     return answers.find(
//       (a) => a.questionIndex === currentIndex
//     )?.selectedIndex;
//   }

//   function calculateScore() {
//     let s = 0;
//     answers.forEach((a) => {
//       if (
//         quiz.questions[a.questionIndex].correctIndex ===
//         a.selectedIndex
//       ) {
//         s++;
//       }
//     });
//     return s;
//   }

//   function submit() {
//     const finalScore = calculateScore();

//     saveAttempt({
//       topic,
//       score: finalScore,
//       total
//     });

//     setScore(finalScore);
//     setSubmitted(true);
//   }

//   function retryQuiz() {
//     setCurrentIndex(0);
//     setAnswers([]);
//     setScore(0);
//     setSubmitted(false);
//   }

//   /* ✅ RESULT SCREEN */
//   if (submitted) {
//   return (
//     <Result
//       score={score}
//       total={total}
//       topic={topic}
//       onRetry={retryQuiz}
//       onSave={async () => {
//         await saveQuiz({ quiz, topic, difficulty }).unwrap();
//         navigate("/dashboard");
//       }}
//       onViewAnswers={() => {
//         navigate("/quiz/answers", {
//           state: {
//             quiz,
//             answers
//           }
//         });
//       }}
//     />
//   );
// }

//   // if (submitted) {
//   //   return (
//   //     <Result
//   //       score={score}
//   //       total={total}
//   //       topic={topic}
//   //       onRetry={retryQuiz}
//   //       onSave={async () => {
//   //         console.log("SAVE PAYLOAD", { quiz, topic, difficulty });
//   //         await saveQuiz({
//   //           quiz,
//   //           topic,
//   //           difficulty
//   //         }).unwrap();

//   //         navigate("/dashboard");
//   //       }}
//   //     />
//   //   );
//   // }

//   return (
//     <div className={styles.container}>
//       {/* Header */}
//       <div className={styles.header}>
//         <h1>AI Quiz</h1>
//         <Timer seconds={total * 30} onEnd={submit} />
//       </div>

//       {/* Progress */}
//       <div className={styles.progress}>
//         Question {currentIndex + 1} of {total}
//       </div>

//       {/* Question */}
//       <div className={styles.card}>
//         <h2 className={styles.questionText}>
//           {question.question}
//         </h2>

//         <div className={styles.options}>
//           {question.options.map((opt, idx) => (
//             <button
//               key={idx}
//               className={`${styles.option} ${
//                 getSelected() === idx
//                   ? styles.selected
//                   : ""
//               }`}
//               onClick={() => selectAnswer(idx)}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Navigation */}
//       <div className={styles.navigation}>
//         <button
//           disabled={currentIndex === 0}
//           onClick={() =>
//             setCurrentIndex((i) => i - 1)
//           }
//         >
//           ← Previous
//         </button>

//         {currentIndex === total - 1 ? (
//           <button
//             className={styles.submitBtn}
//             onClick={submit}
//           >
//             Submit Quiz
//           </button>
//         ) : (
//           <button
//             onClick={() =>
//               setCurrentIndex((i) => i + 1)
//             }
//           >
//             Next →
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }


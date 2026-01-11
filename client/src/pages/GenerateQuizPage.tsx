import { useState } from "react";
import { useGenerateQuizMutation } from "../app/api";
import styles from "../styles/GenerateQuiz.module.scss";
import { useNavigate } from "react-router-dom";

export default function GenerateQuizPage() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [noOfQuestions, setNoOfQuestions] = useState(5);
  const navigate = useNavigate();

  const [generateQuiz, { isLoading, error }] = useGenerateQuizMutation();

  async function handleGenerate() {
    if (!topic.trim()) return alert("Please enter a topic");

    try {
      const res = await generateQuiz({
        topic,
        difficulty,
        noOfQuestions,
      }).unwrap();

      navigate("/quiz/play", {
        state: {
          quiz: res.quiz,
          topic,
          difficulty,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* CLOSE BUTTON (Always visible unless loading) */}
        {!isLoading && (
          <button
            className={styles.closeBtn}
            onClick={() => navigate(-1)}
            title="Cancel and Go Back"
          >
            ✕
          </button>
        )}

        {isLoading ? (
          /* --- NEW LOADING STATE --- */
          <div className={styles.loadingState}>
            <div className={styles.loader}>
              <div className={styles.circle}></div>
              <div className={styles.circle}></div>
              <div className={styles.circle}></div>
            </div>
            <h2>Generating Quiz...</h2>
            <p>Our AI is crafting unique questions about <strong>{topic}</strong></p>
          </div>
        ) : (
          /* --- ORIGINAL FORM --- */
          <>
            <h1>Generate Quiz</h1>
            <p>Create AI-powered quizzes in seconds</p>

            <div className={styles.field}>
              <label>Topic</label>
              <input
                placeholder="e.g. JavaScript, React, DBMS"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className={styles.field}>
                <label>No. of Questions</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={noOfQuestions}
                  onChange={(e) => setNoOfQuestions(+e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className={styles.error}>
                Failed to generate quiz. Try again.
              </div>
            )}

            <button
              className={styles.generateBtn}
              onClick={handleGenerate}
              disabled={isLoading}
            >
              Generate Quiz
            </button>
          </>
        )}
      </div>
    </div>
  );
}








// import { useState } from "react";
// import { useGenerateQuizMutation } from "../app/api";
// import styles from "../styles/GenerateQuiz.module.scss";
// import { useNavigate } from "react-router-dom";

// export default function GenerateQuizPage() {
//   const [topic, setTopic] = useState("");
//   const [difficulty, setDifficulty] = useState("easy");
//   const [noOfQuestions, setNoOfQuestions] = useState(5);
//   const navigate = useNavigate();

//   const [generateQuiz, { isLoading, error }] = useGenerateQuizMutation();

//   async function handleGenerate() {
//     if (!topic.trim()) return alert("Please enter a topic");

//     try {
//       const res = await generateQuiz({
//         topic,
//         difficulty,
//         noOfQuestions,
//       }).unwrap();

//       // navigate to quiz player page
//       console.log("Generated quiz:", res);

//       navigate("/quiz/play", {
//         state: {
//           quiz: res.quiz,
//           topic,
//           difficulty,
//         },
//       });

//       // window.location.href = `/quiz/${res.quiz._id}`;
//     } catch (e) {
//       console.error(e);
//     }
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.card}>
        
//         {/* CLOSE BUTTON */}
//         <button 
//           className={styles.closeBtn} 
//           onClick={() => navigate(-1)}
//           title="Cancel and Go Back"
//         >
//           ✕
//         </button>

//         <h1>Generate Quiz</h1>
//         <p>Create AI-powered quizzes in seconds</p>

//         <div className={styles.field}>
//           <label>Topic</label>
//           <input
//             placeholder="e.g. JavaScript, React, DBMS"
//             value={topic}
//             onChange={(e) => setTopic(e.target.value)}
//           />
//         </div>

//         <div className={styles.row}>
//           <div className={styles.field}>
//             <label>Difficulty</label>
//             <select
//               value={difficulty}
//               onChange={(e) => setDifficulty(e.target.value)}
//             >
//               <option value="easy">Easy</option>
//               <option value="medium">Medium</option>
//               <option value="hard">Hard</option>
//             </select>
//           </div>

//           <div className={styles.field}>
//             <label>No. of Questions</label>
//             <input
//               type="number"
//               min={1}
//               max={50}
//               value={noOfQuestions}
//               onChange={(e) => setNoOfQuestions(+e.target.value)}
//             />
//           </div>
//         </div>

//         {error && (
//           <div className={styles.error}>
//             Failed to generate quiz. Try again.
//           </div>
//         )}

//         <button
//           className={styles.generateBtn}
//           onClick={handleGenerate}
//           disabled={isLoading}
//         >
//           {isLoading ? "Generating…" : "Generate Quiz"}
//         </button>
//       </div>
//     </div>
//   );
// }

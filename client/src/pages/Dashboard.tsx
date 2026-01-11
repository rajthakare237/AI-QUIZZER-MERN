import { useState } from "react";
import styles from "../styles/Dashboard.module.scss";
import { useAppSelector } from "../app/hooks";
import {
  useGetSavedQuizzesQuery,
  useGetAttemptsQuery,
  useDeleteQuizMutation,
  useDeleteAttemptMutation,
  useShareQuizMutation,
} from "../app/api";
import { useNavigate } from "react-router-dom";

// ✅ FIX 1: Defined Interfaces for Type Safety
interface Quiz {
  _id: string;
  topic: string;
  difficulty: string;
  questionsCount: number;
  lastScore: number | null;
}

interface Attempt {
  _id: string;
  topic: string;
  score: number;
  total: number;
  createdAt: string;
}

interface EmptyStateProps {
  title: string;
  message: string;
  icon: string;
  onAction: () => void;
}

const EmptyState = ({ title, message, icon, onAction }: EmptyStateProps) => (
  <div className={styles.emptyState}>
    <div className={styles.emptyIcon}>{icon}</div>
    <h3>{title}</h3>
    <p>{message}</p>
    <button className={styles.createBtn} onClick={onAction}>
      Start Your First Quiz
    </button>
  </div>
);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"quizzes" | "attempts">("quizzes");
  const navigate = useNavigate();

  // Share Logic
  const [shareQuiz] = useShareQuizMutation();
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Delete Confirmation Logic
  const [deleteConfig, setDeleteConfig] = useState<{
    type: "quiz" | "attempt";
    id: string;
  } | null>(null);

  const { data: quizzes = [] } = useGetSavedQuizzesQuery(undefined);
  const { data: attempts = [] } = useGetAttemptsQuery(undefined);
  
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [deleteQuiz] = useDeleteQuizMutation();
  const [deleteAttempt] = useDeleteAttemptMutation();

  const handleGenerateQuiz = () => {
    if (isAuthenticated) {
      navigate("/generate");
    } else {
      navigate("/login");
    }
  };

  const handleCopy = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfig) return;

    if (deleteConfig.type === "quiz") {
      await deleteQuiz(deleteConfig.id);
    } else {
      await deleteAttempt(deleteConfig.id);
    }
    setDeleteConfig(null);
  };

  if(!isAuthenticated){
    navigate("/login");
    return;
  }

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1>Dashboard</h1>
          <p>Your quizzes and previous attempts</p>
        </div>

        <button
          className={styles.createBtn}
          onClick={() => handleGenerateQuiz()}
        >
          + Generate New Quiz
        </button>
      </div>

      {/* TABS */}
      <div className={styles.tabs}>
        <button
          className={activeTab === "quizzes" ? styles.active : ""}
          onClick={() => setActiveTab("quizzes")}
        >
          Saved Quizzes
        </button>

        <button
          className={activeTab === "attempts" ? styles.active : ""}
          onClick={() => setActiveTab("attempts")}
        >
          Previous Attempts
        </button>
      </div>

      {/* SAVED QUIZZES */}
      {activeTab === "quizzes" && (
        <>
          {quizzes.length === 0 ? (
            <EmptyState
              title="No Saved Quizzes Yet"
              message="Generate a quiz to save it here and challenge yourself later!"
              icon="📂"
              onAction={handleGenerateQuiz}
            />
          ) : (
            <div className={styles.grid}>
              {/* ✅ FIX 2: Added Type Annotation for 'q' */}
              {quizzes.map((q: Quiz) => (
                <div key={q._id} className={styles.card}>
                  <button
                    className={styles.delete}
                    onClick={() => setDeleteConfig({ type: "quiz", id: q._id })}
                    title="Delete quiz"
                  >
                    🗑️
                  </button>

                  <h3>{q.topic}</h3>

                  <div className={styles.meta}>
                    <span>Difficulty: {q.difficulty}</span>
                    <span>Questions: {q.questionsCount}</span>
                    <span>
                      Last Score:{" "}
                      {q.lastScore !== null ? `${q.lastScore}%` : "—"}
                    </span>
                  </div>

                  {/* ACTION BUTTONS WRAPPER */}
                  <div className={styles.cardActions}>
                    <button
                      className={styles.retry}
                      onClick={() =>
                        navigate("/quiz/retry", {
                          state: { quizId: q._id },
                        })
                      }
                    >
                      Retry
                    </button>
                    <button
                      className={styles.shareBtn}
                      onClick={async () => {
                        const res = await shareQuiz(q._id).unwrap();
                        setShareLink(res.shareUrl);
                      }}
                    >
                      🔗 Share
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* PREVIOUS ATTEMPTS */}
      {activeTab === "attempts" && (
        <>
          {attempts.length === 0 ? (
            <EmptyState
              title="No Attempts Found"
              message="You haven't taken any quizzes yet. Time to test your knowledge!"
              icon="🎯"
              onAction={handleGenerateQuiz}
            />
          ) : (
            <div className={styles.attemptsGrid}>
              {/* ✅ FIX 3: Added Type Annotation for 'a' */}
              {attempts.map((a: Attempt) => {
                const percentage = Math.round((a.score / a.total) * 100);
                const isPassing = percentage >= 50;

                return (
                  <div key={a._id} className={styles.attemptCard}>
                    <button
                      className={styles.deleteBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfig({ type: "attempt", id: a._id });
                      }}
                      title="Delete attempt"
                    >
                      ✕
                    </button>

                    <div className={styles.cardHeader}>
                      <h3 className={styles.topic}>{a.topic}</h3>
                      <span className={styles.date}>
                        {new Date(a.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className={styles.statsRow}>
                      <div className={styles.scoreGroup}>
                        <span className={styles.scoreLabel}>Score</span>
                        <span className={styles.scoreValue}>
                          {a.score}{" "}
                          <span className={styles.total}>/ {a.total}</span>
                        </span>
                      </div>

                      <div
                        className={`${styles.percentageBadge} ${
                          isPassing ? styles.pass : styles.fail
                        }`}
                      >
                        {percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* SHARE MODAL */}
      {shareLink && (
        <div className={styles.modalOverlay} onClick={() => setShareLink(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>🎉 Quiz Ready to Share</h3>
              <p>Anyone with this link can attempt your quiz.</p>
            </div>

            <div className={styles.inputGroup}>
              <input value={shareLink} readOnly />
            </div>

            <div className={styles.modalActions}>
              <button
                className={`${styles.copyBtn} ${isCopied ? styles.copied : ""}`}
                onClick={handleCopy}
              >
                {isCopied ? "✅ Copied!" : "📋 Copy Link"}
              </button>

              <button
                className={styles.closeBtn}
                onClick={() => setShareLink(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfig && (
        <div
          className={styles.modalOverlay}
          onClick={() => setDeleteConfig(null)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 style={{ color: "#ef4444" }}>⚠️ Confirm Deletion</h3>
              <p>
                Are you sure you want to delete this{" "}
                {deleteConfig.type === "quiz" ? "saved quiz" : "attempt"}? This
                action cannot be undone.
              </p>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.dangerBtn} onClick={confirmDelete}>
                Yes, Delete
              </button>

              <button
                className={styles.closeBtn}
                onClick={() => setDeleteConfig(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}








// import { useState } from "react";
// import styles from "../styles/Dashboard.module.scss";
// import { useAppSelector } from "../app/hooks";
// import {
//   useGetSavedQuizzesQuery,
//   useGetAttemptsQuery,
//   useDeleteQuizMutation,
//   useDeleteAttemptMutation,
//   useShareQuizMutation,
// } from "../app/api";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState<"quizzes" | "attempts">("quizzes");
//   const navigate = useNavigate();

//   // Share Logic
//   const [shareQuiz] = useShareQuizMutation();
//   const [shareLink, setShareLink] = useState<string | null>(null);
//   const [isCopied, setIsCopied] = useState(false);

//   // Delete Confirmation Logic
//   const [deleteConfig, setDeleteConfig] = useState<{
//     type: "quiz" | "attempt";
//     id: string;
//   } | null>(null);

//   const { data: quizzes = [] } = useGetSavedQuizzesQuery();
//   const { data: attempts = [] } = useGetAttemptsQuery();
//   const { isAuthenticated } = useAppSelector((state) => state.auth);

//   const [deleteQuiz] = useDeleteQuizMutation();
//   const [deleteAttempt] = useDeleteAttemptMutation();

//   const handleGenerateQuiz = () => {
//     if (isAuthenticated) {
//       navigate("/generate");
//     } else {
//       navigate("/login");
//     }
//   };

//   const handleCopy = () => {
//     if (shareLink) {
//       navigator.clipboard.writeText(shareLink);
//       setIsCopied(true);
//       setTimeout(() => setIsCopied(false), 2000);
//     }
//   };

//   const confirmDelete = async () => {
//     if (!deleteConfig) return;

//     if (deleteConfig.type === "quiz") {
//       await deleteQuiz(deleteConfig.id);
//     } else {
//       await deleteAttempt(deleteConfig.id);
//     }
//     setDeleteConfig(null);
//   };

//   // Helper Component for Empty State
//   const EmptyState = ({
//     title,
//     message,
//     icon,
//   }: {
//     title: string;
//     message: string;
//     icon: string;
//   }) => (
//     <div className={styles.emptyState}>
//       <div className={styles.emptyIcon}>{icon}</div>
//       <h3>{title}</h3>
//       <p>{message}</p>
//       <button className={styles.createBtn} onClick={handleGenerateQuiz}>
//         Start Your First Quiz
//       </button>
//     </div>
//   );

//   return (
//     <div className={styles.container}>
//       {/* HEADER */}
//       <div className={styles.header}>
//         <div>
//           <h1>Dashboard</h1>
//           <p>Your quizzes and previous attempts</p>
//         </div>

//         <button
//           className={styles.createBtn}
//           onClick={() => handleGenerateQuiz()}
//         >
//           + Generate New Quiz
//         </button>
//       </div>

//       {/* TABS */}
//       <div className={styles.tabs}>
//         <button
//           className={activeTab === "quizzes" ? styles.active : ""}
//           onClick={() => setActiveTab("quizzes")}
//         >
//           Saved Quizzes
//         </button>

//         <button
//           className={activeTab === "attempts" ? styles.active : ""}
//           onClick={() => setActiveTab("attempts")}
//         >
//           Previous Attempts
//         </button>
//       </div>

//       {/* SAVED QUIZZES */}
//       {activeTab === "quizzes" && (
//         <>
//           {quizzes.length === 0 ? (
//             <EmptyState
//               title="No Saved Quizzes Yet"
//               message="Generate a quiz to save it here and challenge yourself later!"
//               icon="📂"
//             />
//           ) : (
//             <div className={styles.grid}>
//               {quizzes.map((q) => (
//                 <div key={q._id} className={styles.card}>
//                   <button
//                     className={styles.delete}
//                     onClick={() => setDeleteConfig({ type: "quiz", id: q._id })}
//                     title="Delete quiz"
//                   >
//                     🗑️
//                   </button>

//                   <h3>{q.topic}</h3>

//                   <div className={styles.meta}>
//                     <span>Difficulty: {q.difficulty}</span>
//                     <span>Questions: {q.questionsCount}</span>
//                     <span>
//                       Last Score:{" "}
//                       {q.lastScore !== null ? `${q.lastScore}%` : "—"}
//                     </span>
//                   </div>

//                   {/* ACTION BUTTONS WRAPPER */}
//                   <div className={styles.cardActions}>
//                     <button
//                       className={styles.retry}
//                       onClick={() =>
//                         navigate("/quiz/retry", {
//                           state: { quizId: q._id },
//                         })
//                       }
//                     >
//                       Retry
//                     </button>
//                     <button
//                       className={styles.shareBtn}
//                       onClick={async () => {
//                         const res = await shareQuiz(q._id).unwrap();
//                         setShareLink(res.shareUrl);
//                       }}
//                     >
//                       🔗 Share
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}

//       {/* PREVIOUS ATTEMPTS */}
//       {activeTab === "attempts" && (
//         <>
//           {attempts.length === 0 ? (
//             <EmptyState
//               title="No Attempts Found"
//               message="You haven't taken any quizzes yet. Time to test your knowledge!"
//               icon="🎯"
//             />
//           ) : (
//             <div className={styles.attemptsGrid}>
//               {attempts.map((a) => {
//                 const percentage = Math.round((a.score / a.total) * 100);
//                 const isPassing = percentage >= 50;

//                 return (
//                   <div key={a._id} className={styles.attemptCard}>
//                     <button
//                       className={styles.deleteBtn}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setDeleteConfig({ type: "attempt", id: a._id });
//                       }}
//                       title="Delete attempt"
//                     >
//                       ✕
//                     </button>

//                     <div className={styles.cardHeader}>
//                       <h3 className={styles.topic}>{a.topic}</h3>
//                       <span className={styles.date}>
//                         {new Date(a.createdAt).toLocaleDateString(undefined, {
//                           year: "numeric",
//                           month: "short",
//                           day: "numeric",
//                         })}
//                       </span>
//                     </div>

//                     <div className={styles.statsRow}>
//                       <div className={styles.scoreGroup}>
//                         <span className={styles.scoreLabel}>Score</span>
//                         <span className={styles.scoreValue}>
//                           {a.score}{" "}
//                           <span className={styles.total}>/ {a.total}</span>
//                         </span>
//                       </div>

//                       <div
//                         className={`${styles.percentageBadge} ${
//                           isPassing ? styles.pass : styles.fail
//                         }`}
//                       >
//                         {percentage}%
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </>
//       )}

//       {/* SHARE MODAL */}
//       {shareLink && (
//         <div className={styles.modalOverlay} onClick={() => setShareLink(null)}>
//           <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//             <div className={styles.modalHeader}>
//               <h3>🎉 Quiz Ready to Share</h3>
//               <p>Anyone with this link can attempt your quiz.</p>
//             </div>

//             <div className={styles.inputGroup}>
//               <input value={shareLink} readOnly />
//             </div>

//             <div className={styles.modalActions}>
//               <button
//                 className={`${styles.copyBtn} ${isCopied ? styles.copied : ""}`}
//                 onClick={handleCopy}
//               >
//                 {isCopied ? "✅ Copied!" : "📋 Copy Link"}
//               </button>

//               <button
//                 className={styles.closeBtn}
//                 onClick={() => setShareLink(null)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* DELETE CONFIRMATION MODAL */}
//       {deleteConfig && (
//         <div
//           className={styles.modalOverlay}
//           onClick={() => setDeleteConfig(null)}
//         >
//           <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//             <div className={styles.modalHeader}>
//               <h3 style={{ color: "#ef4444" }}>⚠️ Confirm Deletion</h3>
//               <p>
//                 Are you sure you want to delete this{" "}
//                 {deleteConfig.type === "quiz" ? "saved quiz" : "attempt"}? This
//                 action cannot be undone.
//               </p>
//             </div>

//             <div className={styles.modalActions}>
//               <button className={styles.dangerBtn} onClick={confirmDelete}>
//                 Yes, Delete
//               </button>

//               <button
//                 className={styles.closeBtn}
//                 onClick={() => setDeleteConfig(null)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

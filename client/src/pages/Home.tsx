import styles from "../styles/Home.module.scss";
import { useGetUserStatsQuery } from "../app/api";
import { useAppSelector } from '../app/hooks';
import { useNavigate } from "react-router-dom";

export default function Home() {
  // ✅ FIX 1: Pass 'undefined' to satisfy the hook's argument requirement
  const { data, isLoading } = useGetUserStatsQuery(undefined);

  // ✅ FIX 2: Removed 'user' since it was unused
  const { isAuthenticated } = useAppSelector(state => state.auth);
  
  const navigate = useNavigate();

  const stats = {
    quizzes: data?.quizzes ?? 0,
    attempts: data?.attempts ?? 0,
    averageScore: data?.averageScore ?? 0
  };

  const handleGenerateQuiz = () => {
    if(isAuthenticated){
      navigate("/generate");
    }
    else{
      navigate("/login");
    }
  }

  const handleViewDashboard = () => {
    if(isAuthenticated){
      navigate("/dashboard");
    }
    else{
      navigate("/login");
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h1>
              Be Smarter with <span>AI Quizzer</span>
            </h1>
            <p>
              Generate AI-powered quizzes on any topic, attempt them with a timer,
              track your progress, and improve every day.
            </p>

            <div className={styles.cta}>
              <button
                className={styles.primary}
                onClick={() => handleGenerateQuiz()}
              >
                Generate Quiz
              </button>
              <button
                className={styles.secondary}
                onClick={() => handleViewDashboard()}
              >
                View Dashboard
              </button>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className={styles.stats}>
          <div>
            <h2>{isLoading ? "—" : stats.quizzes}</h2>
            <p>Saved Quizzes</p>
          </div>
          <div>
            <h2>{isLoading ? "—" : stats.attempts}</h2>
            <p>Total Attempts</p>
          </div>
          <div>
            <h2>{isLoading ? "—" : `${stats.averageScore}%`}</h2>
            <p>Average Score</p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className={styles.how}>
          <h2>How it works</h2>

          <div className={styles.steps}>
            <div>
              <span>Step 1</span>
              <p>Enter Topic, No of Questions & Difficulty</p>
            </div>
            <div>
              <span>Step 2</span>
              <p>AI Generates Quiz Instantly</p>
            </div>
            <div>
              <span>Step 3</span>
              <p>Attempt and Test Your Knowledge</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}




// import styles from "../styles/Home.module.scss";
// import { useGetUserStatsQuery } from "../app/api";
// import { useAppSelector } from '../app/hooks';
// import { useNavigate } from "react-router-dom";

// export default function Home() {
//   const { data, isLoading } = useGetUserStatsQuery();
//   const { isAuthenticated, user } = useAppSelector(state => state.auth);
//   const navigate = useNavigate();

//   const stats = {
//     quizzes: data?.quizzes ?? 0,
//     attempts: data?.attempts ?? 0,
//     averageScore: data?.averageScore ?? 0
//   };

//   const handleGenerateQuiz = () => {
//     if(isAuthenticated){
//       navigate("/generate");
//     }
//     else{
//       navigate("/login");
//     }
//   }

//   const handleViewDashboard = () => {
//     if(isAuthenticated){
//       navigate("/dashboard");
//     }
//     else{
//       navigate("/login");
//     }
//   }

//   return (
//     <div className={styles.page}>
//       <div className={styles.container}>
//         {/* HERO */}
//         <section className={styles.hero}>
//           <div className={styles.heroText}>
//             <h1>
//               Be Smarter with <span>AI Quizzer</span>
//             </h1>
//             <p>
//               Generate AI-powered quizzes on any topic, attempt them with a timer,
//               track your progress, and improve every day.
//             </p>

//             <div className={styles.cta}>
//               <button
//                 className={styles.primary}
//                 onClick={() => handleGenerateQuiz()}
//               >
//                 Generate Quiz
//               </button>
//               <button
//                 className={styles.secondary}
//                 onClick={() => handleViewDashboard()}
//               >
//                 View Dashboard
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* STATS */}
//         <section className={styles.stats}>
//           <div>
//             <h2>{isLoading ? "—" : stats.quizzes}</h2>
//             <p>Saved Quizzes</p>
//           </div>
//           <div>
//             <h2>{isLoading ? "—" : stats.attempts}</h2>
//             <p>Total Attempts</p>
//           </div>
//           <div>
//             <h2>{isLoading ? "—" : `${stats.averageScore}%`}</h2>
//             <p>Average Score</p>
//           </div>
//         </section>

//         {/* HOW IT WORKS */}
//         <section className={styles.how}>
//           <h2>How it works</h2>

//           <div className={styles.steps}>
//             <div>
//               <span>Step 1</span>
//               <p>Enter Topic, No of Questions & Difficulty</p>
//             </div>
//             <div>
//               <span>Step 2</span>
//               <p>AI Generates Quiz Instantly</p>
//             </div>
//             <div>
//               <span>Step 3</span>
//               <p>Attempt and Test Your Knowledge</p>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }



// import styles from "../styles/Home.module.scss";
// import { useGetUserStatsQuery } from "../app/api";
// import { useAppSelector } from '../app/hooks';
// import { useNavigate } from "react-router-dom";

// export default function Home() {
//   const { data, isLoading } = useGetUserStatsQuery();
//   const { isAuthenticated, user } = useAppSelector(state => state.auth);
//   const navigate = useNavigate();

//   const stats = {
//     quizzes: data?.quizzes ?? 0,
//     attempts: data?.attempts ?? 0,
//     averageScore: data?.averageScore ?? 0
//   };

//   const handleGenerateQuiz = () => {
//     if(isAuthenticated){
//       navigate("/generate");
//     }
//     else{
//       navigate("/login");
//     }
//   }

//   const handleViewDashboard = () => {
//     if(isAuthenticated){
//       navigate("/dashboard");
//     }
//     else{
//       navigate("/login");
//     }
//   }

//   return (
//     <div className={styles.page}>
//       <div className={styles.container}>
//         {/* HERO */}
//         <section className={styles.hero}>
//           <div className={styles.heroText}>
//             <h1>
//               Be Smarter with <span>AI Quizzer</span>
//             </h1>
//             <p>
//               Generate AI-powered quizzes on any topic, attempt them with a timer,
//               track your progress, and improve every day.
//             </p>

//             <div className={styles.cta}>
//               <button
//                 className={styles.primary}
//                 onClick={() => handleGenerateQuiz()}
//               >
//                 Generate Quiz
//               </button>
//               <button
//                 className={styles.secondary}
//                 onClick={() => handleViewDashboard()}
//               >
//                 View Dashboard
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* STATS */}
//         <section className={styles.stats}>
//           <div>
//             <h2>{isLoading ? "—" : stats.quizzes}</h2>
//             <p>Saved Quizzes</p>
//           </div>
//           <div>
//             <h2>{isLoading ? "—" : stats.attempts}</h2>
//             <p>Total Attempts</p>
//           </div>
//           <div>
//             <h2>{isLoading ? "—" : `${stats.averageScore}%`}</h2>
//             <p>Average Score</p>
//           </div>
//         </section>

//         {/* HOW IT WORKS */}
//         <section className={styles.how}>
//           <h2>How it works</h2>

//           <div className={styles.steps}>
//             <div>
//               <span>Step 1</span>
//               <p>Enter Topic, No of Questions & Difficulty</p>
//             </div>
//             <div>
//               <span>Step 2</span>
//               <p>AI Generates Quiz Instantly</p>
//             </div>
//             <div>
//               <span>Step 3</span>
//               <p>Attempt and Test Your Knowledge</p>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

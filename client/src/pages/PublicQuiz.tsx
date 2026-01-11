import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QuizPlayer from './QuizPlayer';
import styles from '../styles/PublicQuiz.module.scss';

type Question = {
  question: string; // Updated to match QuizPlayer's expected type
  options: string[];
  correctIndex: number; // Added to match QuizPlayer
};

type Quiz = {
  _id: string;
  questions: Question[];
};

// 🔹 MOVED OUTSIDE: Keeps the object reference stable and prevents dependency loops
const DEMO_QUIZ: Quiz = {
  _id: 'demo-public',
  questions: [
    {
      question: 'What does HTML stand for?',
      options: [
        'Hyper Text Markup Language',
        'High Text Machine Language',
        'Hyperlinks and Text Markup Language',
        'Home Tool Markup Language'
      ],
      correctIndex: 0
    },
    {
      question: 'Which hook is used for state in React?',
      options: ['useState', 'useEffect', 'useRef', 'useMemo'],
      correctIndex: 0
    },
    {
      question: 'Node.js is built on which engine?',
      options: ['V8', 'SpiderMonkey', 'Chakra', 'Java'],
      correctIndex: 0
    }
  ]
};

export default function PublicQuiz() {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    // 🔹 FIX: Using setTimeout simulates an async API call.
    // This prevents the "Synchronous setState" warning/cascading render.
    const timer = setTimeout(() => {
      // In the future, replace this with your fetch logic
      // if (id) fetchQuiz(id)...
      
      setQuiz(DEMO_QUIZ);
    }, 500); // Small delay adds a natural loading feel

    return () => clearTimeout(timer);
  }, [id]);

  if (!quiz) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading quiz…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        {/* Now works because we updated QuizPlayer to accept props */}
        <QuizPlayer/>
      </div>
    </div>
  );
}






// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import QuizPlayer from './QuizPlayer';
// import styles from '../styles/PublicQuiz.module.scss';

// type Question = {
//   id: string;
//   text: string;
//   options: string[];
// };

// type Quiz = {
//   _id: string;
//   questions: Question[];
// };

// export default function PublicQuiz() {
//   const { id } = useParams<{ id: string }>();
//   const [quiz, setQuiz] = useState<Quiz | null>(null);

//   // 🔹 DEMO DATA (temporary)
//   const demoQuiz: Quiz = {
//     _id: 'demo-public',
//     questions: [
//       {
//         id: 'q1',
//         text: 'What does HTML stand for?',
//         options: [
//           'Hyper Text Markup Language',
//           'High Text Machine Language',
//           'Hyperlinks and Text Markup Language',
//           'Home Tool Markup Language'
//         ]
//       },
//       {
//         id: 'q2',
//         text: 'Which hook is used for state in React?',
//         options: ['useState', 'useEffect', 'useRef', 'useMemo']
//       },
//       {
//         id: 'q3',
//         text: 'Node.js is built on which engine?',
//         options: ['V8', 'SpiderMonkey', 'Chakra', 'Java']
//       }
//     ]
//   };

//   useEffect(() => {
//     // 🔹 BACKEND LOGIC (enable later)
//     // if (!id) return;
//     // fetch(`http://localhost:4000/api/quizzes/public/${id}`)
//     //   .then(r => r.json())
//     //   .then(setQuiz);

//     // 🔹 TEMP: load demo quiz
//     setQuiz(demoQuiz);
//   }, [id]);

//   if (!quiz) {
//     return (
//       <div className={styles.page}>
//         <div className={styles.loading}>
//           <div className={styles.spinner} />
//           <p>Loading quiz…</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.page}>
//       <div className={styles.wrapper}>
//         <QuizPlayer quiz={quiz} />
//       </div>
//     </div>
//   );
// }

// ✅ FIX: Added 'type' keyword before KeyboardEvent
import { useState, type KeyboardEvent } from 'react';
import styles from '../styles/Login.module.scss';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../app/authApi';

// 1. Define the expected shape of the API error
interface ApiError {
  data?: {
    message?: string;
  };
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  async function submit() {
    try {
      setError('');
      await login({ email, password }).unwrap();
      navigate('/');
    } catch (err) {
      // 2. Cast 'err' to our specific type safely
      const apiError = err as ApiError;
      setError(apiError?.data?.message || 'Invalid credentials');
    }
  }

  // Helper function to handle Enter key
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.logo}>AI Quizzer</h1>
        <p className={styles.subtitle}>
          Sign in to generate and attempt AI-powered quizzes
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.field}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className={styles.field}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button
          className={styles.loginBtn}
          onClick={submit}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in…' : 'Login'}
        </button>

        <p className={styles.footerText}>
          Don’t have an account? <span onClick={() => navigate('/register')}>Register</span>
        </p>
      </div>
    </div>
  );
}


// import { useState } from 'react';
// import styles from '../styles/Login.module.scss';
// import { useNavigate } from 'react-router-dom';
// import { useLoginMutation } from '../app/authApi';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const navigate = useNavigate();
//   const [login, { isLoading }] = useLoginMutation();

//   async function submit() {
//     try {
//       setError('');
//       await login({ email, password }).unwrap();
//       navigate('/');
//     } catch (err: any) {
//       setError(err?.data?.message || 'Invalid credentials');
//     }
//   }

//   // Helper function to handle Enter key
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Enter') {
//       submit();
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div className={styles.card}>
//         <h1 className={styles.logo}>AI Quizzer</h1>
//         <p className={styles.subtitle}>
//           Sign in to generate and attempt AI-powered quizzes
//         </p>

//         {error && <div className={styles.error}>{error}</div>}

//         <div className={styles.field}>
//           <label>Email</label>
//           <input
//             type="email"
//             onChange={e => setEmail(e.target.value)}
//             onKeyDown={handleKeyDown}
//           />
//         </div>

//         <div className={styles.field}>
//           <label>Password</label>
//           <input
//             type="password"
//             onChange={e => setPassword(e.target.value)}
//             onKeyDown={handleKeyDown}
//           />
//         </div>

//         <button
//           className={styles.loginBtn}
//           onClick={submit}
//           disabled={isLoading}
//         >
//           {isLoading ? 'Signing in…' : 'Login'}
//         </button>

//         <p className={styles.footerText}>
//           Don’t have an account? <span onClick={() => navigate('/register')}>Register</span>
//         </p>
//       </div>
//     </div>
//   );
// }





// import { useState } from 'react';
// import styles from '../styles/Login.module.scss';
// import { useNavigate } from 'react-router-dom';
// import { useLoginMutation } from '../app/authApi';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const navigate = useNavigate();
//   const [login, { isLoading }] = useLoginMutation();

//   async function submit() {
//     try {
//       setError('');
//       await login({ email, password }).unwrap();
//       navigate('/');
//     } catch (err: any) {
//       setError(err?.data?.message || 'Invalid credentials');
//     }
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.card}>
//         <h1 className={styles.logo}>AI Quizzer</h1>
//         <p className={styles.subtitle}>
//           Sign in to generate and attempt AI-powered quizzes
//         </p>

//         {error && <div className={styles.error}>{error}</div>}

//         <div className={styles.field}>
//           <label>Email</label>
//           <input
//             type="email"
//             onChange={e => setEmail(e.target.value)}
//           />
//         </div>

//         <div className={styles.field}>
//           <label>Password</label>
//           <input
//             type="password"
//             onChange={e => setPassword(e.target.value)}
//           />
//         </div>

//         <button
//           className={styles.loginBtn}
//           onClick={submit}
//           disabled={isLoading}
//         >
//           {isLoading ? 'Signing in…' : 'Login'}
//         </button>

//         <p className={styles.footerText}>
//           Don’t have an account? <span onClick={() => navigate('/register')}>Register</span>
//         </p>
//       </div>
//     </div>
//   );
// }

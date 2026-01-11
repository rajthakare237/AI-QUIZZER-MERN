// ✅ FIX 1: Added 'type' for KeyboardEvent for better TS support (optional but recommended)
import { useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Register.module.scss';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  async function submit() {
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Replace with your actual API endpoint
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setSuccess('Account created successfully! Redirecting...');
      setForm({ name: '', email: '', password: '' });
      
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      // ✅ FIX 2: Check if 'err' is actually an Error object
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  // Helper function to handle Enter key
  // ✅ FIX 3: Used the imported type for cleaner syntax
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.logo}>AI Quizzer</h1>
          <p className={styles.subtitle}>Create your account to start generating quizzes.</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.formGroup}>
          <div className={styles.field}>
            <label>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className={styles.field}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            className={styles.registerBtn}
            onClick={submit}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </div>

        <p className={styles.footerText}>
          Already have an account? <span onClick={() => navigate("/login")}>Log in</span>
        </p>
      </div>
    </div>
  );
}










// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import styles from '../styles/Register.module.scss';

// export default function Register() {
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: ''
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const navigate = useNavigate();

//   async function submit() {
//     if (!form.name || !form.email || !form.password) {
//       setError("All fields are required.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');
//       setSuccess('');

//       // Replace with your actual API endpoint
//       const res = await fetch('http://localhost:4000/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(form)
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || 'Registration failed');

//       setSuccess('Account created successfully! Redirecting...');
//       setForm({ name: '', email: '', password: '' });
      
//       setTimeout(() => navigate("/login"), 2000);

//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
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
//         <div className={styles.header}>
//           <h1 className={styles.logo}>AI Quizzer</h1>
//           <p className={styles.subtitle}>Create your account to start generating quizzes.</p>
//         </div>

//         {error && <div className={styles.error}>{error}</div>}
//         {success && <div className={styles.success}>{success}</div>}

//         <div className={styles.formGroup}>
//           <div className={styles.field}>
//             <label>Full Name</label>
//             <input
//               type="text"
//               placeholder="John Doe"
//               value={form.name}
//               onChange={e => setForm({ ...form, name: e.target.value })}
//               onKeyDown={handleKeyDown}
//             />
//           </div>

//           <div className={styles.field}>
//             <label>Email Address</label>
//             <input
//               type="email"
//               placeholder="you@example.com"
//               value={form.email}
//               onChange={e => setForm({ ...form, email: e.target.value })}
//               onKeyDown={handleKeyDown}
//             />
//           </div>

//           <div className={styles.field}>
//             <label>Password</label>
//             <input
//               type="password"
//               placeholder="••••••••"
//               value={form.password}
//               onChange={e => setForm({ ...form, password: e.target.value })}
//               onKeyDown={handleKeyDown}
//             />
//           </div>

//           <button
//             className={styles.registerBtn}
//             onClick={submit}
//             disabled={loading}
//           >
//             {loading ? 'Creating Account...' : 'Sign Up'}
//           </button>
//         </div>

//         <p className={styles.footerText}>
//           Already have an account? <span onClick={() => navigate("/login")}>Log in</span>
//         </p>
//       </div>
//     </div>
//   );
// }




// import { useState } from 'react';
// import styles from '../styles/Register.module.scss';
// import { useNavigate } from 'react-router-dom';

// export default function Register() {
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     password: ''
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const navigate = useNavigate();

//   async function submit() {
//     try {
//       setLoading(true);
//       setError('');
//       setSuccess('');

//       const res = await fetch('http://localhost:4000/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(form)
//       });

//       if (!res.ok) throw new Error('Registration failed');

//       setSuccess('Account created successfully. Please login.');
//       setForm({ name: '', email: '', password: '' });
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.card}>
//         <h1 className={styles.logo}>AI Quizzer</h1>
//         <p className={styles.subtitle}>
//           Create an account to start generating AI quizzes
//         </p>

//         {error && <div className={styles.error}>{error}</div>}
//         {success && <div className={styles.success}>{success}</div>}

//         <div className={styles.field}>
//           <label>Name</label>
//           <input
//             placeholder="Your name"
//             value={form.name}
//             onChange={e => setForm({ ...form, name: e.target.value })}
//           />
//         </div>

//         <div className={styles.field}>
//           <label>Email</label>
//           <input
//             type="email"
//             placeholder="you@example.com"
//             value={form.email}
//             onChange={e => setForm({ ...form, email: e.target.value })}
//           />
//         </div>

//         <div className={styles.field}>
//           <label>Password</label>
//           <input
//             type="password"
//             placeholder="Create a strong password"
//             value={form.password}
//             onChange={e => setForm({ ...form, password: e.target.value })}
//           />
//         </div>

//         <button
//           className={styles.registerBtn}
//           onClick={submit}
//           disabled={loading}
//         >
//           {loading ? 'Creating account…' : 'Register'}
//         </button>

//         <p className={styles.footerText}>
//           Already have an account? <span onClick={() => navigate("/login")}>Login</span>
//         </p>
//       </div>
//     </div>
//   );
// }

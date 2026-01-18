// ✅ FIX 1: Added 'type' for KeyboardEvent for better TS support (optional but recommended)
import { useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Register.module.scss';
// ✅ Import the guest hook
import { useGuestLoginMutation } from '../app/authApi';
import { setCredentials } from '../app/authSlice';
// ✅ Import dispatch hooks
import { useAppDispatch } from '../app/hooks';

// 1. Define the expected shape of the API error
interface ApiError {
  data?: {
    message?: string;
  };
}

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
  const dispatch = useAppDispatch(); // ✅ Initialize dispatch
  const [guestLogin, { isLoading: isGuestLoading }] = useGuestLoginMutation();

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
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

  // ✅ New Guest Handler
  async function handleGuest() {
    try {
      setError('');
      const data = await guestLogin({}).unwrap();
      
      // ✅ Manually save state so the app knows we are logged in
      localStorage.setItem('token', data.token);
      dispatch(setCredentials(data));
      
      navigate('/'); 
    } catch (err) {
      const apiError = err as ApiError;
      setError('Failed to initialize guest session ' + apiError.toString());
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

          {/* ✅ ADJUSTED for perfect centering */}
          {/* Removed marginTop on wrapper (Flex gap above handles it) */}
          <div style={{ marginTop: '0', textAlign: 'center', width: '100%' }}>
             
             {/* Margin Bottom 10px + Button Top Margin 10px = 20px Total. 
                 This matches the 20px Flex Gap above. */}
             <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.9rem' }}>Or</p>
             
             <button
              type="button"
              className={styles.registerBtn}
              onClick={handleGuest}
              disabled={loading || isGuestLoading}
              style={{ backgroundColor: '#6c757d', width: '100%' }} 
            >
              {isGuestLoading ? 'Setting up...' : 'Continue as Guest'}
            </button>
          </div>

        </div>

        <p className={styles.footerText}>
          Already have an account? <span onClick={() => navigate("/login")}>Log in</span>
        </p>
      </div>
    </div>
  );
}



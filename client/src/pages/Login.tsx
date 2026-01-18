// ✅ FIX: Added 'type' keyword before KeyboardEvent
import { useState, type KeyboardEvent } from 'react';
import styles from '../styles/Login.module.scss';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation, useGuestLoginMutation } from '../app/authApi';
// ✅ Import dispatch and action
import { useAppDispatch } from '../app/hooks';
// ✅ FIX: Import setCredentials here
import { setCredentials } from '../app/authSlice';

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
  const dispatch = useAppDispatch(); // ✅ Initialize dispatch
  const [login, { isLoading }] = useLoginMutation();

  const [guestLogin, { isLoading: isGuestLoading }] = useGuestLoginMutation();

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

  // ✅ Updated Guest Handler
  async function handleGuest() {
    try {
      setError('');
      
      // 1. Call API
      const data = await guestLogin({}).unwrap();
      
      // 2. Save Token to LocalStorage (Critical for App.tsx to see it)
      localStorage.setItem('token', data.token);
      
      // 3. Update Redux State immediately
      dispatch(setCredentials(data));
      
      // 4. Redirect
      navigate('/'); 
    } catch (err) {
      console.error(err);
      setError('Failed to initialize guest session');
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
            placeholder='youremail@gmail.com'
          />
        </div>

        <div className={styles.field}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='••••••••'
          />
        </div>

        <button
          className={styles.loginBtn}
          onClick={submit}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in…' : 'Login'}
        </button>

        {/* ✅ Guest Button */}
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.9rem' }}>Or</p>
          
          {/* ✅ UPDATED: Used className={styles.loginBtn} to match UI */}
          <button
            type="button"
            className={styles.loginBtn}
            onClick={handleGuest}
            disabled={isLoading || isGuestLoading}
            style={{ backgroundColor: '#6c757d' }} // Optional: distinct color (grey) but same shape
          >
            {isGuestLoading ? 'Setting up...' : 'Continue as Guest'}
          </button>
        </div>

        <p className={styles.footerText}>
          Don’t have an account? <span onClick={() => navigate('/register')}>Register</span>
        </p>
      </div>
    </div>
  );
}
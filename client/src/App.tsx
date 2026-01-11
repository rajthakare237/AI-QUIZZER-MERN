import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useGetMeQuery } from './app/authApi';
import { useAppDispatch } from './app/hooks';
import { setCredentials, logout } from './app/authSlice';

import Login from './pages/Login';
import Register from './pages/Register';
import GenerateQuizPage from './pages/GenerateQuizPage';
import QuizPlayer from './pages/QuizPlayer';
import Home from './pages/Home';
import Result from './pages/Result';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PublicQuiz from './pages/PublicQuiz';
import Navbar from './components/Navbar';
import RetryQuiz from './pages/RetryQuiz';
import ViewAnswers from './pages/ViewAnswers';
import SharedQuiz from './pages/SharedQuiz';

export default function App() {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');

  const { data, error } = useGetMeQuery(undefined, {
    skip: !token
  });

  useEffect(() => {
    if (data) {
      dispatch(setCredentials(data));
    }
    if (error) {
      dispatch(logout());
    }
  }, [data, error, dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/public" element={<PublicQuiz />} />
        <Route path="/generate" element={<GenerateQuizPage />} />
        <Route path="/quiz/play" element={<QuizPlayer/>} />
        <Route path="/result" element={<Result score={0} total={0} topic="Demo Topic" />} />
        <Route path="/quiz/retry" element={<RetryQuiz />} />
        <Route path="/quiz/answers" element={<ViewAnswers />} />
        <Route path="/quiz/shared/:token" element={<SharedQuiz />} />
      </Routes>
    </BrowserRouter>
  );
}

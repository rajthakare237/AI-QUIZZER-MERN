import { useNavigate } from "react-router-dom";
import styles from "../styles/Result.module.scss";
import { useAppSelector } from "../app/hooks";

type Props = {
  score: number;
  total: number;
  topic: string;
  onSave?: () => void;
  onRetry?: () => void;
  onViewAnswers?: () => void; // ✅ NEW
};

export default function Result({
  score,
  total,
  topic,
  onSave,
  onRetry,
  onViewAnswers,
}: Props) {
  const percentage = Math.round((score / total) * 100);
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Quiz Completed 🎉</h1>
        <p className={styles.topic}>Topic: {topic}</p>

        <div className={styles.scoreCircle}>
          <span>{percentage}%</span>
        </div>

        <p className={styles.scoreText}>
          You scored <strong>{score}</strong> out of <strong>{total}</strong>
        </p>

        <div className={styles.actions}>
          {isAuthenticated && (
            <button className={styles.primary} onClick={onSave}>
              💾 Save Quiz
            </button>
          )}

          <button className={styles.secondary} onClick={onRetry}>
            🔁 Retry Quiz
          </button>

          {/* ✅ NEW BUTTON */}
          <button className={styles.secondary} onClick={onViewAnswers}>
            👀 View Answers
          </button>
        </div>
        {isAuthenticated ? (
          <button
            className={styles.link}
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        ) : (
          <button
            className={styles.link}
            onClick={() => navigate("/")}
          >
            ← Home
          </button>
        )}
      </div>
    </div>
  );
}

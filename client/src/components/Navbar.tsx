import styles from '../styles/Navbar.module.scss';
import { useAppSelector } from '../app/hooks';
import { AVATARS } from '../constants/avatars';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  // ✅ FIX: Default to ID 1 if undefined, and subtract 1 for array index
  const avatarIndex = (user?.avatarId || 1) - 1;
  const avatarUrl = AVATARS[avatarIndex]?.url || AVATARS[0].url;

  return (
    <nav className={styles.navbar}>
      {/* Left */}
      <div className={styles.left}>
        <h1
          className={styles.logo}
          onClick={() => navigate('/')}
        >
          AI Quizzer
        </h1>

        <div className={styles.links}>
          <span onClick={() => navigate('/')}>Home</span>
          <span onClick={() => navigate('/dashboard')}>
            Dashboard
          </span>
        </div>
      </div>

      {/* Right */}
      <div className={styles.right}>
        {isAuthenticated ? (
          <div
            className={styles.profile}
            onClick={() => navigate('/profile')}
          >
            {/* ✅ FIX: Use the safe URL calculated above */}
            <img src={avatarUrl} alt="Profile" />
          </div>
        ) : (
          <button
            className={styles.loginBtn}
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}


// import styles from '../styles/Navbar.module.scss';
// import { useAppSelector } from '../app/hooks';
// import { AVATARS } from '../constants/avatars';
// import { useNavigate } from 'react-router-dom';

// export default function Navbar() {

//   const { isAuthenticated, user } = useAppSelector(state => state.auth);
//   const avatarId = user?.avatarId;

//   const navigate = useNavigate();

//   const auth = useAppSelector(state => state.auth);
//   console.log('AUTH STATE:', auth);


//   return (
//     <nav className={styles.navbar}>
//       {/* Left */}
//       <div className={styles.left}>
//         <h1
//           className={styles.logo}
//           onClick={() => navigate('/')}
//         >
//           AI Quizzer
//         </h1>

//         <div className={styles.links}>
//           <span onClick={() => navigate('/')}>Home</span>
//           <span onClick={() => navigate('/dashboard')}>
//             Dashboard
//           </span>
//         </div>
//       </div>

//       {/* Right */}
//       <div className={styles.right}>
//         {isAuthenticated ? (
//           <div
//             className={styles.profile}
//             onClick={() => navigate('/profile')}
//           >
//             <img src={AVATARS[Number(avatarId)+1].url} alt="Profile" />
//           </div>
//         ) : (
//           <button
//             className={styles.loginBtn}
//             onClick={() => navigate('/login')}
//           >
//             Login
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// }

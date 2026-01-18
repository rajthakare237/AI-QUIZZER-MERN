import { useState } from "react";
import styles from "../styles/Profile.module.scss";
import { AVATARS } from "../constants/avatars";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout, updateUser } from "../app/authSlice";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [editMode, setEditMode] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [userObj, setUser] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    // Ensure default is 1, not 0
    avatarId: user?.avatarId || 1,
  });

  // 🔐 Guard
  if (!isAuthenticated || !user) {
    return <div>Loading profile...</div>;
  }

  // Helper to safely get avatar URL
  // ID 1 -> Index 0
  const getAvatarUrl = (id: number) => {
    const index = id - 1;
    return AVATARS[index]?.url || AVATARS[0].url;
  };

  async function saveProfile() {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userObj.name,
          avatarId: userObj.avatarId,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      const data = await res.json();

      // ✅ update redux immediately
      dispatch(updateUser(data));
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  }

  function logoutProfile() {
    dispatch(logout());
    navigate("/");
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>User Profile</h1>

        {/* AVATAR (LIVE UPDATE) */}
        <div className={styles.avatar}>
          {/* ✅ FIX: Use helper or subtract 1 */}
          <img 
            src={getAvatarUrl(userObj.avatarId)} 
            alt="Current Avatar" 
          />
        </div>

        {editMode && (
          <div className={styles.avatarGrid}>
            {AVATARS.map((a) => (
              <img
                key={a.id}
                src={a.url}
                className={`${styles.avatarOption} ${
                  // Check against ID directly
                  userObj.avatarId === a.id ? styles.active : ""
                }`}
                // Set ID directly (1-8)
                onClick={() => setUser({ ...userObj, avatarId: a.id })}
              />
            ))}
          </div>
        )}

        <div className={styles.field}>
          <label>Name</label>
          <input
            value={userObj.name}
            disabled={!editMode}
            onChange={(e) =>
              setUser({ ...userObj, name: e.target.value })
            }
          />
        </div>

        <div className={styles.field}>
          <label>Email</label>
          <input value={userObj.email} disabled />
        </div>

        <div className={styles.actions}>
          {editMode ? (
            <>
              <button
                className={styles.primary}
                onClick={saveProfile}
              >
                Save
              </button>
              <button
                className={styles.secondary}
                onClick={() => {
                  setEditMode(false);
                  // Reset on cancel
                  setUser({
                    name: user.name,
                    email: user.email,
                    avatarId: user.avatarId,
                  });
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className={styles.primary}
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
              <button
                className={styles.logout}
                onClick={logoutProfile}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

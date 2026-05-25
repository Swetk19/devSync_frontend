import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(Number(user.age));
  const [gender, setGender] = useState(user.gender);
  const [about, setAbout] = useState(user.about);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);
  const dispatch = useDispatch();

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, photoUrl, age, gender, about },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } catch (err) {
      console.log(err?.response?.data);
      setError(err?.response?.data?.message || err?.response?.data || err.message);
    }
  };

  return (
    <div style={styles.wrapper}>

      {/* Toast */}
      {toast && (
        <div style={styles.toast}>
          ✅ Profile saved successfully!
        </div>
      )}

      {/* Edit Form Card */}
      <div style={styles.card}>
        <h2 style={styles.title}>Edit Profile</h2>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>First Name</label>
            <input
              style={styles.input}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Last Name</label>
            <input
              style={styles.input}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Photo URL</label>
          <input
            style={styles.input}
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Age</label>
            <input
              style={styles.input}
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              placeholder="25"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Gender</label>
            <input
              style={styles.input}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              placeholder="Male / Female / Other"
            />
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>About</label>
          <textarea
            style={{ ...styles.input, minHeight: "60px", resize: "vertical" }}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell others about yourself..."
          />
        </div>

        {error && <p style={styles.error}>⚠️ {error}</p>}

        <button style={styles.btn} onClick={saveProfile}>
          Save Profile
        </button>
      </div>

      {/* Live Preview */}
      <div style={styles.previewWrapper}>
        <p style={styles.previewLabel}>Live Preview</p>
        <UserCard user={{ firstName, lastName, photoUrl, age, gender, about }} />
      </div>

    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "32px",
    minHeight: "100vh",
    background: "#0d1117",
    padding: "20px",
    fontFamily: "'Exo 2', sans-serif",
    flexWrap: "wrap",
    position: "relative",
  },
  toast: {
    position: "fixed",
    bottom: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "linear-gradient(135deg, #0d9e6e, #067a52)",
    color: "#d0fff0",
    padding: "10px 20px",
    borderRadius: "50px",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    boxShadow: "0 8px 30px rgba(0,200,120,0.3)",
    zIndex: 9999,
  },
  card: {
    background: "linear-gradient(160deg, #161b27 0%, #0f1520 100%)",
    border: "1px solid rgba(0,200,255,0.12)",
    borderRadius: "12px",
    padding: "18px 22px",
    width: "100%",
    maxWidth: "320px",
    boxShadow: "0 0 60px rgba(0,180,255,0.04), 0 24px 64px rgba(0,0,0,0.6)",
  },
  title: {
    color: "#e0eeff",
    textAlign: "center",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "14px",
    paddingBottom: "10px",
    borderBottom: "1px solid rgba(0,200,255,0.1)",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  field: {
    marginBottom: "8px",
  },
  label: {
    display: "block",
    fontSize: "9px",
    color: "#5a8aaa",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "4px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(0,180,255,0.12)",
    borderRadius: "5px",
    color: "#c9dff0",
    fontSize: "12px",
    padding: "6px 10px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  error: {
    color: "#ff6b6b",
    fontSize: "11px",
    marginBottom: "8px",
    background: "rgba(255,80,80,0.08)",
    padding: "6px 10px",
    borderRadius: "5px",
    border: "1px solid rgba(255,80,80,0.2)",
  },
  btn: {
    width: "100%",
    marginTop: "4px",
    padding: "8px",
    background: "linear-gradient(135deg, #0099cc, #006fa6)",
    border: "none",
    borderRadius: "5px",
    color: "#e0f4ff",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "2px",
    textTransform: "uppercase",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(0,150,200,0.25)",
    transition: "opacity 0.2s",
  },
  previewWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  previewLabel: {
    fontSize: "9px",
    color: "#3a6080",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontWeight: "600",
  },
};

export default EditProfile;
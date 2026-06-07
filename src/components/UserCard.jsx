import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const SKILL_COLORS = [
  "bg-primary/10 text-primary border-primary/30",
  "bg-secondary/10 text-secondary border-secondary/30",
  "bg-accent/10 text-accent border-accent/30",
  "bg-success/10 text-success border-success/30",
  "bg-warning/10 text-warning border-warning/30",
  "bg-error/10 text-error border-error/30",
  "bg-info/10 text-info border-info/30",
];

const VISIBLE_SKILLS = 4;

const UserCard = ({ user, hideMatch = false }) => {
  const {
    _id, firstName, lastName, photoUrl, about,
    skills = [], gender, experienceLevel, location, githubUrl,
  } = user || {};

  const currentUser = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(false);

  const matchPercent = (() => {
    const mySkills = (currentUser?.skills || []).map((s) => s.trim().toLowerCase());
    const theirSkills = (skills || []).map((s) => s.trim().toLowerCase());
    if (mySkills.length === 0 || theirSkills.length === 0) return 0;
    const matched = theirSkills.filter((s) => mySkills.includes(s)).length;
    const totalUnique = new Set([...mySkills, ...theirSkills]).size;
    return Math.round((matched / totalUnique) * 100);
  })();

  const matchLabel = `${matchPercent}% Match`;
  const overflowCount = skills.length - VISIBLE_SKILLS;

  const handleSendRequest = async (status) => {
    try {
      dispatch(removeUserFromFeed(_id));
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMessageClick = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <>
      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: "32px", left: "50%",
          transform: "translateX(-50%)",
          background: "#1e1e2e", color: "#fff",
          padding: "10px 20px", borderRadius: "999px",
          fontSize: "13px", fontWeight: 500,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          zIndex: 9999, whiteSpace: "nowrap",
          border: "1px solid rgba(255,255,255,0.1)",
        }}>
          🔒 Connect first to start chatting
        </div>
      )}

      {/* ── MODAL ── */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 9998,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: "24px",
              width: "360px",
              maxHeight: "85vh",
              overflowY: "auto",
              padding: "28px 24px",
              display: "flex", flexDirection: "column", gap: "14px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              position: "relative",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute", top: "16px", right: "16px",
                background: "var(--card-inner)", border: "1px solid var(--card-border)",
                borderRadius: "50%", width: "28px", height: "28px",
                cursor: "pointer", fontSize: "14px", color: "var(--base-content)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ✕
            </button>

            {/* Avatar */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <div style={{
                background: "linear-gradient(135deg, #a78bfa, #ec4899)",
                borderRadius: "50%", padding: "3px", width: "88px", height: "88px",
              }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", padding: "2px", background: "var(--card-bg)" }}>
                  <div style={{
                    width: "100%", height: "100%", borderRadius: "50%",
                    overflow: "hidden", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "34px", background: "var(--card-inner)",
                  }}>
                    {photoUrl
                      ? <img src={photoUrl} alt={firstName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : gender === "female" ? "👩" : "🧑‍💻"
                    }
                  </div>
                </div>
              </div>

              {/* Name */}
              <p style={{ fontSize: "18px", fontWeight: 700, margin: 0, color: "var(--base-content)", textAlign: "center" }}>
                {firstName} {lastName}
              </p>

              {/* Match badge */}
              {!hideMatch && (
                <span style={{
                  background: "#ec4899", color: "#fff", fontSize: "11px",
                  fontWeight: 700, padding: "3px 12px", borderRadius: "999px",
                  boxShadow: "0 2px 12px rgba(236,72,153,0.4)",
                }}>
                  {matchLabel}
                </span>
              )}
            </div>

            {/* Experience + Location */}
            {(experienceLevel || location?.country || location) && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
                {experienceLevel && (
                  <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "8px", background: "var(--card-inner)", border: "1px solid var(--card-border)", color: "var(--base-content)", opacity: 0.7 }}>
                    💼 {experienceLevel}
                  </span>
                )}
                {(location?.country || typeof location === "string") && (
                  <span style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "8px", background: "var(--card-inner)", border: "1px solid var(--card-border)", color: "var(--base-content)", opacity: 0.7 }}>
                    📍 {location?.country || location}
                  </span>
                )}
              </div>
            )}

            {/* Bio */}
            {about && (
              <div style={{ background: "var(--card-inner)", borderRadius: "12px", padding: "12px 14px" }}>
                <p style={{ fontSize: "13px", color: "var(--base-content)", opacity: 0.7, lineHeight: 1.6, margin: 0 }}>
                  "{about}"
                </p>
              </div>
            )}

            {/* All Skills */}
            {skills.length > 0 && (
              <div>
                <p style={{ fontSize: "11px", fontWeight: 600, opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px", color: "var(--base-content)" }}>
                  Skills
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {skills.map((skill, i) => (
                    <span key={i} className={`text-xs px-3 py-1 rounded-full border font-medium ${SKILL_COLORS[i % SKILL_COLORS.length]}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px", color: "var(--base-content)" }}>
                Links
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                {githubUrl ? (
                  <a href={githubUrl} target="_blank" rel="noreferrer"
                    style={{ fontSize: "12px", color: "#a78bfa", textDecoration: "none" }}>
                    GitHub →
                  </a>
                ) : <span style={{ fontSize: "12px", opacity: 0.3 }}>No GitHub</span>}
                {user?.linkedinUrl && (
                  <a href={user.linkedinUrl} target="_blank" rel="noreferrer"
                    style={{ fontSize: "12px", color: "#a78bfa", textDecoration: "none" }}>
                    LinkedIn →
                  </a>
                )}
                {user?.portfolioUrl && (
                  <a href={user.portfolioUrl} target="_blank" rel="noreferrer"
                    style={{ fontSize: "12px", color: "#a78bfa", textDecoration: "none" }}>
                    Portfolio →
                  </a>
                )}
              </div>
            </div>

            {/* Action buttons inside modal */}
            <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
              <button
                onClick={() => { setShowModal(false); handleSendRequest("ignored"); }}
                style={{
                  flex: 1, height: "38px", borderRadius: "999px",
                  fontWeight: 600, fontSize: "13px", cursor: "pointer",
                  background: "transparent", border: "2px solid #f87171", color: "#f87171",
                }}
              >
                Ignore
              </button>
              <button
                onClick={() => { setShowModal(false); handleSendRequest("interested"); }}
                style={{
                  flex: 1, height: "38px", borderRadius: "999px",
                  fontWeight: 600, fontSize: "13px", cursor: "pointer",
                  border: "none", background: "linear-gradient(135deg, #a78bfa, #7c3aed)", color: "#fff",
                }}
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CARD ── */}
      <div
        style={{
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          background: "var(--card-bg)",
          border: "1px solid var(--card-border)",
          boxShadow: "0 4px 32px rgba(0,0,0,0.13)",
          width: "340px", height: "400px",
          borderRadius: "20px", overflow: "hidden",
          display: "flex", flexDirection: "column",
          position: "relative", boxSizing: "border-box",
        }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
          .match-badge {
            background: #ec4899; color: #fff; font-size: 11px; font-weight: 700;
            padding: 4px 12px; border-radius: 999px; white-space: nowrap;
            box-shadow: 0 2px 12px rgba(236,72,153,0.45); letter-spacing: 0.02em;
          }
          .uc-scroll::-webkit-scrollbar { display: none; }
          .social-icon-btn {
            width: 28px; height: 28px; border-radius: 50%;
            border: 1px solid var(--card-border); background: var(--card-inner);
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; font-size: 13px; transition: background 0.15s;
            text-decoration: none; opacity: 0.6;
          }
          .social-icon-btn:hover { opacity: 1; background: var(--card-border); }
          .more-btn:hover { opacity: 0.8 !important; }
          .action-icon-btn:hover { background: var(--card-inner) !important; }
        `}</style>

        {/* SCROLLABLE BODY */}
        <div className="uc-scroll" style={{
          flex: 1, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none",
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "18px 20px 12px", gap: "8px",
        }}>
          {/* Avatar + Match badge */}
          <div style={{ position: "relative", marginBottom: "2px" }}>
            <div style={{
              background: "linear-gradient(135deg, #a78bfa, #ec4899)",
              borderRadius: "50%", padding: "3px", width: "96px", height: "96px",
            }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", padding: "2px", background: "var(--card-bg)" }}>
                <div style={{
                  width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "38px", background: "var(--card-inner)",
                }}>
                  {photoUrl
                    ? <img src={photoUrl} alt={firstName} draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : gender === "female" ? "👩" : "🧑‍💻"
                  }
                </div>
              </div>
            </div>
            {!hideMatch && (
              <span className="match-badge" style={{ position: "absolute", top: "-6px", right: "-68px" }}>
                {matchLabel}
              </span>
            )}
          </div>

          {/* Name */}
          <p style={{ fontSize: "17px", fontWeight: 600, textAlign: "center", margin: 0, color: "var(--base-content)" }}>
            {firstName} {lastName}
          </p>

          {/* Experience + Location */}
          {(experienceLevel || location?.country || location) && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
              {experienceLevel && (
                <span style={{ fontSize: "11px", padding: "2px 9px", borderRadius: "8px", background: "var(--card-inner)", border: "1px solid var(--card-border)", color: "var(--base-content)", opacity: 0.7 }}>
                  💼 {experienceLevel}
                </span>
              )}
              {(location?.country || typeof location === "string") && (
                <span style={{ fontSize: "11px", padding: "2px 9px", borderRadius: "8px", background: "var(--card-inner)", border: "1px solid var(--card-border)", color: "var(--base-content)", opacity: 0.7 }}>
                  📍 {location?.country || location}
                </span>
              )}
            </div>
          )}

          {/* Social Links */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center", justifyContent: "center" }}>
            {githubUrl ? (
              <a href={githubUrl} target="_blank" rel="noreferrer" className="social-icon-btn" title="GitHub">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                </svg>
              </a>
            ) : (
              <span className="social-icon-btn" title="No GitHub" style={{ cursor: "default", opacity: 0.25 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                </svg>
              </span>
            )}
            {user?.linkedinUrl && (
              <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="social-icon-btn" title="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            )}
            {user?.portfolioUrl && (
              <a href={user.portfolioUrl} target="_blank" rel="noreferrer" className="social-icon-btn" title="Portfolio">
                🌐
              </a>
            )}
          </div>

          {/* Bio */}
          {about && (
            <p style={{ fontSize: "12px", textAlign: "center", opacity: 0.5, lineHeight: 1.5, padding: "0 4px", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              "{about}"
            </p>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px", width: "100%", marginTop: "6px" }}>
              {(showAllSkills ? skills : skills.slice(0, VISIBLE_SKILLS)).map((skill, i) => (
                <span key={i} className={`text-xs px-3 py-1 rounded-full border font-medium ${SKILL_COLORS[i % SKILL_COLORS.length]}`}>
                  {skill}
                </span>
              ))}
              {overflowCount > 0 && (
                <span
                  className="more-btn"
                  onClick={() => setShowAllSkills(!showAllSkills)}
                  style={{
                    fontSize: "11px", padding: "3px 10px", borderRadius: "999px",
                    background: "var(--card-inner)", border: "1px solid var(--card-border)",
                    opacity: 0.5, cursor: "pointer",
                  }}
                >
                  {showAllSkills ? "Show less" : `+${overflowCount} more`}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--card-border)", flexShrink: 0 }} />

        {/* ACTION BAR */}
        <div style={{
          height: "56px", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 16px", background: "var(--card-bg)",
        }}>
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {/* 💬 Message — shows toast */}
            <button
              title="Connect first to message"
              onClick={handleMessageClick}
              className="action-icon-btn"
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", padding: "6px", lineHeight: 1, borderRadius: "8px", transition: "background 0.15s" }}
            >
              💬
            </button>
            {/* ℹ️ Info — opens modal */}
            <button
              title="View full profile"
              onClick={() => setShowModal(true)}
              className="action-icon-btn"
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", padding: "6px", lineHeight: 1, borderRadius: "8px", transition: "background 0.15s" }}
            >
              ℹ️
            </button>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => handleSendRequest("ignored")}
              style={{ height: "34px", padding: "0 20px", borderRadius: "999px", fontFamily: "inherit", fontWeight: 600, fontSize: "13px", cursor: "pointer", background: "transparent", border: "2px solid #f87171", color: "#f87171" }}
            >
              Ignore
            </button>
            <button
              onClick={() => handleSendRequest("interested")}
              style={{ height: "34px", padding: "0 20px", borderRadius: "999px", fontFamily: "inherit", fontWeight: 600, fontSize: "13px", cursor: "pointer", border: "none", background: "linear-gradient(135deg, #a78bfa, #7c3aed)", color: "#fff" }}
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCard;
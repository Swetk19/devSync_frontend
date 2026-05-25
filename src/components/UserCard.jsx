import { useState } from "react";

const UserCard = ({ user }) => {
  const { firstName, lastName, age, about, skills, gender, photoUrl } = user || {};
  const [hovered, setHovered] = useState(null);

  return (
    <div
      style={{
        position: "relative",
        width: "288px",
        borderRadius: "24px",
        overflow: "hidden",
        border: "1px solid rgba(248,180,255,0.25)",
      }}
    >
      {/* Photo or emoji fallback */}
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={firstName}
          style={{ width: "100%", height: "340px", objectFit: "cover", display: "block" }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "340px",
            background: "linear-gradient(160deg, #f8e1f4 0%, #e8d5f5 40%, #d5e8f5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "96px",
            lineHeight: 1,
            paddingBottom: "120px", // shifts emoji up
          }}
        >
          {gender === "female" ? "👩" : "👨"}
        </div>
      )}

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(to top, rgba(80,20,80,0.97) 0%, rgba(80,20,80,0.6) 35%, transparent 60%)",
        }}
      />

      {/* Info */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: "74px", padding: "0 16px" }}>
        <p style={{ fontSize: "21px", color: "#fff", margin: "0 0 3px", fontWeight: 600 }}>
          {firstName} {lastName}
        </p>

        {(age || gender) && (
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", margin: "0 0 6px" }}>
            {age}{age && gender ? " · " : ""}{gender}
          </p>
        )}

        {about && (
          <p style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.7)",
            margin: "0 0 9px",
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {about}
          </p>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {skills?.slice(0, 3).map((skill, i) => (
            <span key={i} style={{
              fontSize: "10px", padding: "3px 10px", borderRadius: "999px",
              background: "rgba(255,255,255,0.15)", color: "#fff",
              border: "0.5px solid rgba(255,255,255,0.3)",
            }}>
              {skill}
            </span>
          ))}
          {skills?.length > 3 && (
            <span style={{
              fontSize: "10px", padding: "3px 10px", borderRadius: "999px",
              background: "rgba(255,255,255,0.15)", color: "#fff",
              border: "0.5px solid rgba(255,255,255,0.3)",
            }}>
              +{skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Buttons — smaller */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: "28px", padding: "10px 14px",
        background: "rgba(60,15,60,0.95)",
        borderTop: "0.5px solid rgba(255,255,255,0.08)",
      }}>
        <button
          aria-label="Ignore"
          onMouseEnter={() => setHovered("ignore")}
          onMouseLeave={() => setHovered(null)}
          style={{
            width: 42, height: 42, borderRadius: "50%",
            background: "#ffe4e4", border: "none",
            fontSize: "18px", cursor: "pointer", color: "#c0392b",
            transform: hovered === "ignore" ? "scale(1.15)" : "scale(1)",
            transition: "transform 0.15s",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ✕
        </button>

        <button
          aria-label="Interested"
          onMouseEnter={() => setHovered("interested")}
          onMouseLeave={() => setHovered(null)}
          style={{
            width: 42, height: 42, borderRadius: "50%",
            background: "#d4f5e9", border: "none",
            fontSize: "18px", cursor: "pointer", color: "#0f6e56",
            transform: hovered === "interested" ? "scale(1.15)" : "scale(1)",
            transition: "transform 0.15s",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ♥
        </button>
      </div>
    </div>
  );
};

export default UserCard;
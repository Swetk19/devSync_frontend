import { useState, useRef, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const SWIPE_THRESHOLD = 100;
const STAMP_THRESHOLD = 50;

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, age, about, skills, gender, photoUrl } = user || {};

  const [hovered, setHovered] = useState(null);
  const [popup, setPopup] = useState(null);
  const [dragX, setDragX] = useState(0);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const dragXRef = useRef(0);
  const cardRef = useRef(null);

  const dispatch = useDispatch();

  const handleSendRequest = useCallback(
    async (status, userId) => {
      try {
        setPopup(status);
        setTimeout(() => {
          dispatch(removeUserFromFeed(userId));
          setPopup(null);
        }, 800);
        await axios.post(
          BASE_URL + "/request/send/" + status + "/" + userId,
          {},
          { withCredentials: true }
        );
      } catch (err) {
        console.error(err);
      }
    },
    [dispatch]
  );

  const flyOut = useCallback(
    (direction) => {
      const status = direction === "right" ? "interested" : "ignored";
      const tx = direction === "right" ? "150%" : "-150%";
      const rot = direction === "right" ? "30deg" : "-30deg";

      if (cardRef.current) {
        cardRef.current.style.transition = "transform 0.4s ease, opacity 0.4s ease";
        cardRef.current.style.transform = `translateX(${tx}) rotate(${rot})`;
        cardRef.current.style.opacity = "0";
      }
      setTimeout(() => handleSendRequest(status, _id), 350);
    },
    [_id, handleSendRequest]
  );

  const onPointerDown = useCallback((e) => {
    if (e.target.closest("button")) return;
    isDragging.current = true;
    startX.current = e.clientX;
    dragXRef.current = 0;
    if (cardRef.current) {
      cardRef.current.style.transition = "none";
      cardRef.current.style.cursor = "grabbing";
      cardRef.current.setPointerCapture(e.pointerId);
    }
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    const val = e.clientX - startX.current;
    dragXRef.current = val;
    setDragX(val);
    const rotation = val * 0.08;
    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${val}px) rotate(${rotation}deg)`;
    }
  }, []);

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const val = dragXRef.current;

    if (cardRef.current) {
      cardRef.current.style.cursor = "grab";
    }

    if (val > SWIPE_THRESHOLD) {
      flyOut("right");
    } else if (val < -SWIPE_THRESHOLD) {
      flyOut("left");
    } else {
      if (cardRef.current) {
        cardRef.current.style.transition = "transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        cardRef.current.style.transform = "translateX(0) rotate(0deg)";
      }
      setDragX(0);
      dragXRef.current = 0;
    }
  }, [flyOut]);

  const swipeDirection =
    dragX > STAMP_THRESHOLD ? "interested" : dragX < -STAMP_THRESHOLD ? "ignored" : null;
  const stampOpacity = Math.min(Math.abs(dragX) / 120, 1);

  return (
    <div
      ref={cardRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: "relative",
        width: "288px",
        borderRadius: "24px",
        overflow: "hidden",
        border: "1px solid rgba(248,180,255,0.25)",
        cursor: "grab",
        userSelect: "none",
        touchAction: "none",
        willChange: "transform",
      }}
    >
      {/* LIKE stamp */}
      <div style={{
        position: "absolute", top: "1.2rem", right: "1.2rem", zIndex: 10,
        opacity: swipeDirection === "interested" ? stampOpacity : 0,
        pointerEvents: "none",
        border: "3px solid #1D9E75", color: "#1D9E75",
        padding: "4px 14px", borderRadius: "6px",
        fontSize: "22px", fontWeight: "bold",
        transform: "rotate(12deg)", transition: "opacity 0.05s",
        background: "rgba(0,0,0,0.25)",
      }}>
        LIKE
      </div>

      {/* NOPE stamp */}
      <div style={{
        position: "absolute", top: "1.2rem", left: "1.2rem", zIndex: 10,
        opacity: swipeDirection === "ignored" ? stampOpacity : 0,
        pointerEvents: "none",
        border: "3px solid #D85A30", color: "#D85A30",
        padding: "4px 14px", borderRadius: "6px",
        fontSize: "22px", fontWeight: "bold",
        transform: "rotate(-12deg)", transition: "opacity 0.05s",
        background: "rgba(0,0,0,0.25)",
      }}>
        NOPE
      </div>

      {/* Popup overlay */}
      {popup && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: popup === "interested" ? "rgba(0,200,100,0.18)" : "rgba(220,50,50,0.18)",
          animation: "fadeInOut 0.8s ease forwards",
        }}>
          <div style={{
            fontSize: "90px",
            animation: "popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
          }}>
            {popup === "interested" ? "💚" : "❌"}
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          0%   { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeInOut {
          0%   { opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* Photo or emoji fallback */}
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={firstName}
          draggable={false}
          style={{
            width: "100%", height: "340px",
            objectFit: "cover", display: "block",
            pointerEvents: "none",
          }}
        />
      ) : (
        <div style={{
          width: "100%", height: "340px",
          background: "linear-gradient(160deg, #f8e1f4 0%, #e8d5f5 40%, #d5e8f5 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "96px", lineHeight: 1, paddingBottom: "120px",
        }}>
          {gender === "female" ? "👩" : "👨"}
        </div>
      )}

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(to top, rgba(80,20,80,0.97) 0%, rgba(80,20,80,0.6) 35%, transparent 60%)",
      }} />

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
            fontSize: "12px", color: "rgba(255,255,255,0.7)", margin: "0 0 9px",
            lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
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

      {/* Buttons */}
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
          onClick={(e) => { e.stopPropagation(); flyOut("left"); }}
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
          onClick={(e) => { e.stopPropagation(); flyOut("right"); }}
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
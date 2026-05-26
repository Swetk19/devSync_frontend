import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [reloading, setReloading] = useState(false);

  const getFeed = async () => {
    if (feed !== null) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.error("Feed error:", err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const handleRefresh = async () => {
    setReloading(true);
    try {
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setReloading(false);
    }
  };

  if (feed === null) return null;

  // ✅ Empty state with refresh button
  if (feed.length === 0) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
        height: "calc(100vh - 64px)",
      }}>
        <div style={{ fontSize: "48px" }}>🎉</div>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "18px", margin: 0 }}>
          You've seen everyone!
        </p>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: 0 }}>
          Check back later for new developers
        </p>
        <button
          onClick={handleRefresh}
          disabled={reloading}
          style={{
            marginTop: "8px",
            padding: "10px 28px",
            borderRadius: "999px",
            border: "1px solid rgba(248,180,255,0.3)",
            background: "rgba(255,255,255,0.07)",
            color: "#fff",
            fontSize: "14px",
            cursor: reloading ? "not-allowed" : "pointer",
            opacity: reloading ? 0.5 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {reloading ? "Loading..." : "🔄 Refresh"}
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "calc(100vh - 64px)",
    }}>
      <div style={{ position: "relative", width: "288px", height: "420px" }}>

        {feed[2] && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 1,
            transform: "scale(0.90) translateY(24px)",
            pointerEvents: "none",
            borderRadius: "24px", overflow: "hidden",
          }}>
            <UserCard user={feed[2]} />
          </div>
        )}

        {feed[1] && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 2,
            transform: "scale(0.95) translateY(12px)",
            pointerEvents: "none",
            borderRadius: "24px", overflow: "hidden",
          }}>
            <UserCard user={feed[1]} />
          </div>
        )}

        <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
          <UserCard key={feed[0]._id} user={feed[0]} />
        </div>

      </div>
    </div>
  );
};

export default Feed;
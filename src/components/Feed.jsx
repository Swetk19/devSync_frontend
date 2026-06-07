import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, setSelectedSkills, clearSkillFilter } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import SideProfileCard from "./SideProfileCard";
import SocialLinksCard from "./SocialLinksCard";
import RightSidebar from "./RightSidebar";

const Feed = () => {
  const { users: feed, selectedSkills } = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [reloading, setReloading] = useState(false);
  const [stats, setStats] = useState({ connectionCount: 0, requestCount: 0, unreadCount: 0 });

  const getFeed = async (skills = []) => {
    try {
      const skillsParam = skills.length ? `?skills=${skills.join(",")}` : "";
      const res = await axios.get(BASE_URL + "/feed" + skillsParam, { withCredentials: true });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.error("Feed error:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const [connectionsRes, requestsRes] = await Promise.all([
        axios.get(BASE_URL + "/user/connections", { withCredentials: true }),
        axios.get(BASE_URL + "/user/requests/received", { withCredentials: true }),
      ]);
      setStats({
        connectionCount: connectionsRes.data.data.length,
        requestCount: requestsRes.data.data.length,
        unreadCount: 0,
      });
    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  useEffect(() => { getFeed(selectedSkills); }, [selectedSkills]);
  useEffect(() => { fetchStats(); }, []);

  const handleRefresh = async () => {
    setReloading(true);
    try { await getFeed(selectedSkills); }
    finally { setReloading(false); }
  };

  if (feed === null) return null;

  return (
    <div style={{
      width: "100%",
      minHeight: "calc(100vh - 64px)",
      boxSizing: "border-box",
      paddingTop: "24px",
      paddingBottom: "24px",
      overflowX: "auto",
    }}>

      {/* Main 3-column layout */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "260px 340px 260px",
        gap: "16px",
        alignItems: "start",
        width: "900px",
        margin: "0 auto",
      }}>

        {/* Left Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingTop: "20px" }}>
          <SideProfileCard stats={stats} />
          <SocialLinksCard />
        </div>

        {/* Center Feed */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          paddingTop: "20px",
        }}>

          {feed.length === 0 ? (

            /* Empty state */
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: "16px", paddingTop: "60px"
            }}>
              <div style={{ fontSize: "48px" }}>🎉</div>
              <p className="text-base-content/70" style={{ fontSize: "18px", margin: 0 }}>
                {selectedSkills.length > 0 ? "No devs found with those skills" : "You've seen everyone!"}
              </p>
              <p className="text-base-content/40" style={{ fontSize: "13px", margin: 0 }}>
                {selectedSkills.length > 0 ? "Try removing a skill filter" : "Check back later for new developers"}
              </p>
              <button
                onClick={handleRefresh}
                disabled={reloading}
                className="text-base-content/80 hover:text-base-content transition-colors"
                style={{
                  marginTop: "8px", padding: "10px 28px",
                  borderRadius: "999px", border: "1px solid var(--card-border)",
                  background: "var(--card-inner)", fontSize: "14px",
                  cursor: reloading ? "not-allowed" : "pointer",
                  opacity: reloading ? 0.5 : 1,
                }}
              >
                {reloading ? "Loading..." : "🔄 Refresh"}
              </button>
            </div>

          ) : (
            <>
              {/* Card Stack */}
              <div style={{
                position: "relative",
                width: "340px",
                height: "470px",
                flexShrink: 0,
                overflow: "hidden",
              }}>

                {/* 3rd card (back) */}
                {feed[2] && (
                  <div style={{
                    position: "absolute", top: 0, left: "50%",
                    transform: "translateX(-50%) scale(0.91) translateY(22px)",
                    transformOrigin: "top center",
                    width: "340px", height: "470px",
                    zIndex: 1, pointerEvents: "none",
                    borderRadius: "20px", overflow: "hidden",
                    opacity: 0.45,
                  }}>
                    <UserCard user={feed[2]} hideMatch={true} />
                  </div>
                )}

                {/* 2nd card (middle) */}
                {feed[1] && (
                  <div style={{
                    position: "absolute", top: 0, left: "50%",
                    transform: "translateX(-50%) scale(0.96) translateY(11px)",
                    transformOrigin: "top center",
                    width: "340px", height: "470px",
                    zIndex: 2, pointerEvents: "none",
                    borderRadius: "20px", overflow: "hidden",
                    opacity: 0.7,
                  }}>
                    <UserCard user={feed[1]} hideMatch={true} />
                  </div>
                )}

                {/* 1st card (front) */}
                <div style={{
                  position: "absolute", top: 0, left: "50%",
                  transform: "translateX(-50%)",
                  width: "340px", height: "470px",
                  zIndex: 3, borderRadius: "20px",
                  overflow: "hidden",
                }}>
                  <UserCard key={feed[0]._id} user={feed[0]} />
                </div>

              </div>

              {/* Skill filter pills */}
              <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                {selectedSkills.length > 0 ? (
                  <p className="text-base-content/50" style={{ fontSize: "12px", textAlign: "center", margin: 0 }}>
                    Filtering:{" "}
                    <strong style={{ color: "#c084fc" }}>{selectedSkills.join(", ")}</strong>
                    <button
                      onClick={() => dispatch(clearSkillFilter())}
                      style={{
                        marginLeft: "8px", background: "none", border: "none",
                        color: "#c084fc", cursor: "pointer", fontSize: "12px",
                      }}
                    >
                      ✕ Clear
                    </button>
                  </p>
                ) : (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                    {["React", "Node", "JavaScript", "Python", "Java", "TypeScript"].map((skill) => (
                      <button
                        key={skill}
                        onClick={() => dispatch(setSelectedSkills([skill]))}
                        className="text-base-content/60 hover:text-base-content transition-colors"
                        style={{
                          padding: "4px 14px", borderRadius: "999px",
                          border: "1px solid var(--card-border)",
                          background: "var(--card-inner)",
                          fontSize: "12px", cursor: "pointer",
                        }}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar */}
        <RightSidebar />

      </div>
    </div>
  );
};

export default Feed;
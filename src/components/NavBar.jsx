import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { setSelectedSkills, clearSkillFilter } from "../utils/feedSlice";
import ThemeToggle from "./ThemeToggle";

const SKILL_SUGGESTIONS = [
  "React", "Node", "JavaScript", "Python", "Java",
  "TypeScript", "MongoDB", "Express", "CSS", "HTML",
  "Docker", "AWS", "GraphQL", "Next.js", "PostgreSQL"
];

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const feedState = useSelector((store) => store.feed);
  const selectedSkills = feedState?.selectedSkills || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isFeedPage = location.pathname === "/feed";

  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = SKILL_SUGGESTIONS.filter(
    (s) => s.toLowerCase().includes(searchInput.toLowerCase()) && !selectedSkills.includes(s)
  );

  const handleAddSkill = (skill) => {
    if (selectedSkills.includes(skill)) return;
    dispatch(setSelectedSkills([...selectedSkills, skill]));
    setSearchInput("");
    setShowSuggestions(false);
  };

  const handleRemoveSkill = (skill) => {
    dispatch(setSelectedSkills(selectedSkills.filter((s) => s !== skill)));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchInput.trim()) handleAddSkill(searchInput.trim());
    if (e.key === "Escape") setShowSuggestions(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="navbar bg-base-300 shadow-lg px-6" style={{ position: "relative", zIndex: 1000 }}>

      {/* ── Logo ── */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost tracking-wide text-2xl">
          👨‍💻
          <span className="font-extrabold leading-none">
            <span className="text-teal-300" style={{ fontSize: "22px" }}>Dev</span>
            <span className="text-rose-400" style={{ fontSize: "32px" }}>Sync</span>
          </span>
        </Link>
      </div>

      {/* ── Search Bar (center, only on feed page) ── */}
      {user && isFeedPage && (
        <div style={{ position: "relative", width: "360px", marginRight: "16px" }}>

          {/* Input */}
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "999px", padding: "7px 16px",
          }}>
            <span>🔍</span>

            {/* Active skill tags */}
            {selectedSkills.map((skill) => (
              <span key={skill} style={{
                display: "flex", alignItems: "center", gap: "3px",
                background: "rgba(168,85,247,0.3)",
                border: "1px solid rgba(168,85,247,0.5)",
                borderRadius: "999px", padding: "1px 8px",
                color: "#e9d5ff", fontSize: "11px", fontWeight: 500,
              }}>
                {skill}
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  style={{
                    background: "none", border: "none", color: "#e9d5ff",
                    cursor: "pointer", padding: 0, fontSize: "13px", lineHeight: 1,
                  }}
                >×</button>
              </span>
            ))}

            <input
              value={searchInput}
              onChange={(e) => { setSearchInput(e.target.value); setShowSuggestions(true); }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder={selectedSkills.length === 0 ? "Search skills or people..." : "Add more..."}
              style={{
                flex: 1, minWidth: "80px", background: "none", border: "none",
                outline: "none", fontSize: "13px",
                color: "var(--fallback-bc,oklch(var(--bc)/1))",
              }}
            />

            {selectedSkills.length > 0 && (
              <button
                onClick={() => dispatch(clearSkillFilter())}
                style={{
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.5)",
                  cursor: "pointer", fontSize: "13px",
                }}
              >✕</button>
            )}
          </div>

          {/* Dropdown suggestions */}
          {showSuggestions && searchInput && filteredSuggestions.length > 0 && (
            <div style={{
              position: "absolute", left: 0, right: 0, top: "110%",
              background: "var(--fallback-b1,oklch(var(--b1)/1))",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px", overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              zIndex: 9999,
            }}>
              {filteredSuggestions.slice(0, 6).map((skill) => (
                <div
                  key={skill}
                  onMouseDown={() => handleAddSkill(skill)}
                  style={{
                    padding: "10px 16px", cursor: "pointer", fontSize: "13px",
                    color: "var(--fallback-bc,oklch(var(--bc)/1))",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(168,85,247,0.2)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  {skill}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Theme Toggle ── */}
      <ThemeToggle />

      {/* ── Authenticate button ── */}
      {!user && (
        <Link to="/login" className="btn btn-primary rounded-full px-6 text-white">
          Authenticate
        </Link>
      )}

      {/* ── Avatar + Welcome ── */}
      {user && (
        <div className="flex gap-2 items-center">
          <span className="text-sm text-base-content/70 hidden sm:block">
            Welcome,{" "}
            <span className="text-teal-300 font-semibold">{user.firstName}</span> 👋
          </span>

          <div className="dropdown dropdown-end mx-3">
            <div tabIndex="0" role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-teal-300 ring-offset-base-100 ring-offset-2">
                <img
                  alt="User Avatar"
                  src={user.photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                />
              </div>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow-lg"
            >
              <li><Link to="/feed">Feed</Link></li>
              <li>
                <Link to="/profile" className="justify-between">
                  Profile <span className="badge bg-teal-300 text-black border-0">New</span>
                </Link>
              </li>
              <li><Link to="/connections">Connections</Link></li>
              <li><Link to="/requests">Requests</Link></li>
              <li><a onClick={handleLogout} className="text-rose-400">Logout</a></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { addConnections } from "../utils/connectionSlice";
import AICoach from "./AICoach";

const cardStyle = { background: "var(--card-bg)", border: "1px solid var(--card-border)" };
const innerStyle = { background: "var(--card-inner)" };

const RewindCard = () => {
  const [ignored, setIgnored] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [actioned, setActioned] = useState({});

  const fetchIgnored = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/user/requests/ignored", { withCredentials: true });
      setIgnored(res.data?.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleConnect = async (userId, requestId) => {
    try {
      await axios.patch(BASE_URL + "/request/rewind/" + requestId, {}, { withCredentials: true });
      setActioned((prev) => ({ ...prev, [userId]: "connected" }));
    } catch (err) { console.error(err); }
  };

  const handleIgnore = (userId) => setActioned((prev) => ({ ...prev, [userId]: "ignored" }));

  return (
    <div className="rounded-2xl p-3.5 shadow-sm" style={cardStyle}>
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-sm text-base-content">🔄 REWIND</span>
        <span className="text-xs font-semibold text-success bg-success/10 px-2 py-0.5 rounded-full border border-success/30">
          ACTIVE
        </span>
      </div>

      <p className="text-xs text-base-content/50 mb-2.5 leading-relaxed">
        Review developers you previously passed on. Connect or confirm your choice.
      </p>

      {!open ? (
        <button
          onClick={() => { setOpen(true); fetchIgnored(); }}
          className="w-full py-2 rounded-xl bg-primary text-primary-content font-semibold text-xs cursor-pointer flex items-center justify-center gap-1.5 border-none hover:bg-primary/90 transition"
        >
          🔄 View Ignored History
        </button>
      ) : (
        <div>
          {loading && <p className="text-xs text-base-content/50 text-center">Loading...</p>}
          {!loading && ignored.length === 0 && (
            <p className="text-xs text-base-content/50 text-center py-2.5">No ignored developers yet.</p>
          )}
          {!loading && ignored.map((item) => {
            const dev = item.fromUserId;
            const id = dev?._id;
            const status = actioned[id];
            if (status === "ignored") return null;
            return (
              <div key={id} className={`flex items-center gap-2 py-2 transition-opacity ${status === "connected" ? "opacity-40" : "opacity-100"}`}
                style={{ borderBottom: "1px solid var(--card-border)" }}>
                <img
                  src={dev?.photoUrl || "https://api.dicebear.com/7.x/thumbs/svg?seed=" + id}
                  alt={dev?.firstName}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  style={{ border: "1px solid var(--card-border)" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="m-0 text-xs font-semibold text-base-content truncate">{dev?.firstName} {dev?.lastName}</p>
                  <p className="m-0 text-[10px] text-base-content/50 truncate">{dev?.skills?.slice(0, 3).join(" · ") || "No skills listed"}</p>
                </div>
                {status === "connected" ? (
                  <span className="text-[10px] text-success font-semibold">✓ Sent</span>
                ) : (
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => handleIgnore(id)}
                      className="px-2 py-0.5 rounded-full text-base-content/60 text-[10px] cursor-pointer"
                      style={{ ...innerStyle, border: "1px solid var(--card-border)" }}>
                      Skip
                    </button>
                    <button onClick={() => handleConnect(id, item._id)}
                      className="px-2 py-0.5 rounded-full bg-primary text-primary-content text-[10px] font-semibold cursor-pointer border-none">
                      Connect
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          <button onClick={() => setOpen(false)} className="mt-2 bg-transparent border-none text-base-content/40 text-xs cursor-pointer p-0">
            ↑ Collapse
          </button>
        </div>
      )}
    </div>
  );
};

const AllStarCard = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const connections = useSelector((store) => store.connections);
  const requests = useSelector((store) => store.requests);

  // ✅ Fetch connections if not loaded yet
  useEffect(() => {
    if (!connections) {
      axios
        .get(BASE_URL + "/user/connections", { withCredentials: true })
        .then((res) => dispatch(addConnections(res.data.data)))
        .catch((err) => console.error(err));
    }
  }, [connections]);

  const skills = user?.skills?.length || 0;
  const hasPhoto = !!user?.photoUrl;
  const hasBio = !!user?.about;
  const hasGithub = !!user?.githubUrl;

  // ✅ Safely handle null or array for both
  const connectionCount = Array.isArray(connections) ? connections.length : 0;
  const requestCount = Array.isArray(requests) ? requests.length : 0;

  const checks = [
    { label: "Profile photo added", done: hasPhoto },
    { label: "Bio / About written", done: hasBio },
    { label: "5+ skills listed", done: skills >= 5 },
    { label: "GitHub linked", done: hasGithub },
    { label: "First connection made", done: connectionCount > 0 },
  ];

  const completedCount = checks.filter((c) => c.done).length;
  const pct = Math.round((completedCount / checks.length) * 100);
  const visMultiplier = pct >= 80 ? "3×" : pct >= 50 ? "2×" : "1×";
  const isAllStar = pct === 100;

  return (
    <div className="rounded-2xl p-3.5 shadow-sm" style={cardStyle}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="font-bold text-sm text-base-content">⭐ ALL-STAR PROFILE</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${isAllStar ? "text-success bg-success/10 border-success/30" : "text-warning bg-warning/10 border-warning/30"}`}>
          {isAllStar ? "COMPLETE" : "IN PROGRESS"}
        </span>
      </div>

      <div className="mb-2.5">
        <div className="flex justify-between text-xs text-base-content/50 mb-1">
          <span>Profile strength</span>
          <span className="font-semibold text-primary">{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={innerStyle}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${isAllStar ? "bg-success" : "bg-primary"}`}
            style={{ width: pct + "%" }}
          />
        </div>
      </div>

      {/* ✅ Now shows real connection and request counts */}
      <div className="flex gap-2 mb-2.5">
        {[
          { label: "Visibility", value: visMultiplier },
          { label: "Connections", value: connectionCount },
          { label: "Requests", value: requestCount },
        ].map((s) => (
          <div key={s.label} className="flex-1 rounded-lg p-1.5 text-center"
            style={{ ...innerStyle, border: "1px solid var(--card-border)" }}>
            <p className="m-0 font-bold text-sm text-base-content">{s.value}</p>
            <p className="m-0 text-[9px] text-base-content/50">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        {checks.map((c) => (
          <div key={c.label} className="flex items-center gap-1.5">
            <span className="text-sm">{c.done ? "✅" : "⬜"}</span>
            <span className={`text-xs ${c.done ? "text-success" : "text-base-content/50"}`}>{c.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-2.5 p-2 rounded-lg border border-success/20 bg-success/10">
        <span className="text-base">🚀</span>
        <div className="flex-1">
          <p className="m-0 text-xs font-semibold text-base-content">Boost Active</p>
          <p className="m-0 text-[10px] text-success">{isAllStar ? "Ranking Top 1% 🎉" : `${completedCount}/${checks.length} tasks done`}</p>
        </div>
        <div className={`w-2 h-2 rounded-full ${isAllStar ? "bg-success" : "bg-warning"}`} />
      </div>
    </div>
  );
};

const RecommendedSkillsCard = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [saving, setSaving] = useState(null);
  const [toast, setToast] = useState("");

  const ALL_SKILLS = ["Express.js", "MongoDB", "PostgreSQL", "Docker", "AWS", "Redis", "TypeScript", "Next.js", "Tailwind", "tRPC"];
  const userSkills = user?.skills || [];
  const suggestions = ALL_SKILLS.filter((s) => !userSkills.includes(s));

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const handleAdd = async (skill) => {
    setSaving(skill);
    try {
      const updatedSkills = [...userSkills, skill];
      const res = await axios.patch(BASE_URL + "/profile/edit", { skills: updatedSkills }, { withCredentials: true });
      dispatch(addUser(res.data.data));
      showToast(`✅ ${skill} added to your profile!`);
    } catch (err) {
      showToast("❌ Failed to save skill.");
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="rounded-2xl p-3.5 shadow-sm relative" style={cardStyle}>
      <p className="font-bold text-sm text-base-content m-0 mb-1">💡 Recommended Skills</p>
      <p className="text-xs text-base-content/50 m-0 mb-2.5">Add these to boost your profile visibility.</p>

      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((skill) => {
          const isSaving = saving === skill;
          return (
            <button
              key={skill}
              onClick={() => !isSaving && handleAdd(skill)}
              disabled={isSaving}
              className="px-2.5 py-1 rounded-full border-dashed text-base-content/70 text-xs font-medium cursor-pointer hover:text-primary transition-colors disabled:opacity-50"
              style={{ ...innerStyle, border: "1px dashed var(--card-border)" }}
            >
              {isSaving ? "..." : `+ ${skill}`}
            </button>
          );
        })}
        {suggestions.length === 0 && (
          <p className="text-xs text-success font-semibold">🎉 You have all recommended skills!</p>
        )}
      </div>

      {toast && (
        <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-base-content text-base-100 text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap z-10 pointer-events-none">
          {toast}
        </div>
      )}
    </div>
  );
};

const RightSidebar = () => {
  return (
    <div className="flex flex-col gap-3" style={{ paddingTop: "20px" }}>
      <AICoach />
      <RewindCard />
      <AllStarCard />
      <RecommendedSkillsCard />
    </div>
  );
};

export default RightSidebar;
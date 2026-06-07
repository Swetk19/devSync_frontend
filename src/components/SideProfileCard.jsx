import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdPeople, MdPersonAdd, MdChat } from "react-icons/md";
import { BsShareFill } from "react-icons/bs";

const VISIBLE_SKILLS = 5;

const SideProfileCard = ({ stats = {}, onShare }) => {
  const user = useSelector((store) => store.user);
  const [showAllSkills, setShowAllSkills] = useState(false);

  if (!user) return null;

  const allSkills = user.skills || [];
  const visibleSkills = showAllSkills ? allSkills : allSkills.slice(0, VISIBLE_SKILLS);
  const overflowCount = allSkills.length - VISIBLE_SKILLS;

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition"
      style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>

      <div className="h-16" style={{ background: "var(--card-inner)" }} />

      <div className="relative px-4 pb-4 text-center" style={{ paddingTop: "44px" }}>
        <style>{`
          @keyframes spinRing {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>

        <div className="absolute left-1/2 -translate-x-1/2" style={{ width: "72px", height: "72px", top: "-36px" }}>
          <div className="absolute inset-0 rounded-full" style={{
            background: "conic-gradient(from 0deg, #a855f7, #6366f1, #06b6d4, #a855f7)",
            animation: "spinRing 3s linear infinite"
          }} />
          <div className="absolute inset-1 rounded-full" style={{ background: "var(--card-bg)" }} />
          <div className="absolute inset-1.5 rounded-full overflow-hidden flex items-center justify-center text-2xl"
            style={{ background: "var(--card-inner)" }}>
            {user.photoUrl
              ? <img src={user.photoUrl} alt={user.firstName} className="w-full h-full object-cover" />
              : <span>👤</span>
            }
          </div>
        </div>

        <Link to="/profile" className="block font-bold text-base text-base-content hover:text-primary transition mb-0.5">
          {user.firstName} {user.lastName}
        </Link>

        <p className="text-xs text-base-content/50 truncate px-2 mb-2">{user.emailId}</p>

        <div className="flex flex-wrap justify-center gap-1">
          {allSkills.length > 0 ? (
            <>
              {visibleSkills.map((skill, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full text-base-content/70"
                  style={{ background: "var(--card-inner)", border: "1px solid var(--card-border)" }}>
                  {skill}
                </span>
              ))}
              {overflowCount > 0 && (
                <span
                  onClick={() => setShowAllSkills(!showAllSkills)}
                  className="text-xs px-2 py-0.5 rounded-full text-base-content/50 cursor-pointer hover:opacity-80"
                  style={{ background: "var(--card-inner)", border: "1px solid var(--card-border)" }}
                >
                  {showAllSkills ? "Show less" : `+${overflowCount} more`}
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-base-content/50 italic">Add skills in profile</span>
          )}
        </div>
      </div>

      <div className="h-px mt-3" style={{ background: "var(--card-border)" }} />

      <div className="px-2 py-1">
        {[
          { to: "/connections", icon: MdPeople,    label: "Connections", count: stats.connectionCount ?? 0, active: false },
          { to: "/requests",    icon: MdPersonAdd, label: "Requests",    count: stats.requestCount ?? 0,    active: (stats.requestCount ?? 0) > 0 },
          { to: "/chat",        icon: MdChat,      label: "Chat",        count: stats.unreadCount ?? 0,      active: (stats.unreadCount ?? 0) > 0 },
        ].map(({ to, icon: Icon, label, count, active }) => (
          <Link key={to} to={to}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-base-content transition"
            onMouseEnter={e => e.currentTarget.style.background = "var(--card-inner)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div className="flex items-center gap-2">
              <Icon className="text-lg text-primary" />
              <span className="text-sm font-medium">{label}</span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${active ? "bg-primary text-primary-content" : "text-base-content/60"}`}
              style={!active ? { background: "var(--card-inner)" } : {}}>
              {count}
            </span>
          </Link>
        ))}
      </div>

      <div className="h-px" style={{ background: "var(--card-border)" }} />

      <div className="px-3 py-2">
        <button onClick={onShare}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-base-content/60 hover:text-primary transition"
          onMouseEnter={e => e.currentTarget.style.background = "var(--card-inner)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <BsShareFill /> Share Profile
        </button>
      </div>
    </div>
  );
};

export default SideProfileCard;
import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter, FaUser, FaImage, FaVenusMars, FaInfoCircle } from "react-icons/fa";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(user.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [githubUrl, setGithubUrl] = useState(user.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(user.linkedinUrl || "");
  const [twitterUrl, setTwitterUrl] = useState(user.twitterUrl || "");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) return;
    if (skills.length >= 25) return;
    setSkills([...skills, trimmed]);
    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, photoUrl, gender, about, skills, githubUrl, linkedinUrl, twitterUrl },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setToast(true);
      setTimeout(() => { setToast(false); navigate("/feed"); }, 3000);
    } catch (err) {
      setError(err?.response?.data?.message || err?.response?.data || err.message);
    }
  };

  return (
    <div className="flex flex-wrap justify-center items-start gap-10 min-h-screen bg-base-200 px-6 py-10">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-success text-success-content text-sm font-semibold px-8 py-3 rounded-full shadow-xl z-50 flex items-center gap-2">
          ✅ Profile saved! Redirecting...
        </div>
      )}

      {/* ── Form Card ── */}
      <div className="card bg-base-100 shadow-xl w-full max-w-md border border-base-300 rounded-2xl overflow-hidden">

        {/* Card Header */}
        <div className="bg-gradient-to-r from-primary/10 via-base-100 to-secondary/10 px-6 pt-6 pb-4 border-b border-base-300">
          <h2 className="text-center text-sm font-bold tracking-[4px] uppercase text-base-content">
            Edit Profile
          </h2>
          <p className="text-center text-xs text-base-content/40 mt-1">Update your public developer profile</p>
        </div>

        <div className="card-body gap-4 p-6">

          {/* ── Basic Info Section ── */}
          <p className="text-[10px] font-bold tracking-[2px] uppercase text-base-content/40">Basic Info</p>

          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="form-control gap-1">
              <label className="flex items-center gap-1 text-[10px] font-semibold text-base-content/50 uppercase tracking-wider">
                <FaUser className="text-[10px]" /> First Name
              </label>
              <input className="input input-bordered input-sm w-full focus:input-primary transition-all"
                value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="John" />
            </div>
            <div className="form-control gap-1">
              <label className="flex items-center gap-1 text-[10px] font-semibold text-base-content/50 uppercase tracking-wider">
                <FaUser className="text-[10px]" /> Last Name
              </label>
              <input className="input input-bordered input-sm w-full focus:input-primary transition-all"
                value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Doe" />
            </div>
          </div>

          {/* Photo URL */}
          <div className="form-control gap-1">
            <label className="flex items-center gap-1 text-[10px] font-semibold text-base-content/50 uppercase tracking-wider">
              <FaImage className="text-[10px]" /> Photo URL
            </label>
            <input className="input input-bordered input-sm w-full focus:input-primary transition-all"
              value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg" />
          </div>

          {/* Gender */}
          <div className="form-control gap-1">
            <label className="flex items-center gap-1 text-[10px] font-semibold text-base-content/50 uppercase tracking-wider">
              <FaVenusMars className="text-[10px]" /> Gender
            </label>
            <select className="select select-bordered select-sm w-full focus:select-primary transition-all"
              value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* About */}
          <div className="form-control gap-1">
            <label className="flex items-center gap-1 text-[10px] font-semibold text-base-content/50 uppercase tracking-wider">
              <FaInfoCircle className="text-[10px]" /> About
            </label>
            <textarea className="textarea textarea-bordered text-sm resize-none w-full focus:textarea-primary transition-all"
              rows={3} value={about} onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell others about yourself..." />
          </div>

          {/* Divider */}
          <div className="divider my-0 text-[10px] text-base-content/30 uppercase tracking-widest">Skills</div>

          {/* Skills */}
          <div className="form-control gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-semibold text-base-content/50 uppercase tracking-wider">
                Add Skills
              </label>
              <span className="text-[10px] text-base-content/30">{skills.length}/25</span>
            </div>
            <div className="flex gap-2">
              <input className="input input-bordered input-sm flex-1 focus:input-primary transition-all"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                placeholder="e.g. React, Node.js..." />
              <button onClick={addSkill} className="btn btn-sm btn-primary px-4">+</button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-3 bg-base-200 rounded-xl border border-base-300">
                {skills.map((skill, i) => (
                  <span key={i} className="badge badge-sm gap-1 pr-1 font-medium">
                    {skill}
                    <button onClick={() => removeSkill(skill)}
                      className="text-error/70 hover:text-error font-bold text-xs ml-0.5">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Social Presence ── */}
          <div className="divider my-0 text-[10px] text-primary uppercase tracking-widest font-bold">Social Presence</div>

          <div className="flex flex-col gap-0 rounded-xl border border-base-300 overflow-hidden">
            {/* GitHub */}
            <div className="flex items-center gap-3 px-4 py-3 bg-base-100 border-b border-base-300 hover:bg-base-200 transition-colors">
              <FaGithub className="text-lg text-base-content shrink-0" />
              <input
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-base-content/30 text-base-content"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>
            {/* LinkedIn */}
            <div className="flex items-center gap-3 px-4 py-3 bg-base-100 border-b border-base-300 hover:bg-base-200 transition-colors">
              <FaLinkedin className="text-lg text-blue-500 shrink-0" />
              <input
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-base-content/30 text-base-content"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            {/* Twitter */}
            <div className="flex items-center gap-3 px-4 py-3 bg-base-100 hover:bg-base-200 transition-colors">
              <FaTwitter className="text-lg text-sky-400 shrink-0" />
              <input
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-base-content/30 text-base-content"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>

          {error && (
            <div className="alert alert-error text-xs py-2 px-4 rounded-lg">⚠️ {error}</div>
          )}

          <button className="btn btn-primary w-full tracking-widest uppercase text-xs mt-1 rounded-xl"
            onClick={saveProfile}>
            Save Profile
          </button>

        </div>
      </div>

      {/* ── Live Preview ── */}
      <div className="flex flex-col items-center gap-3 sticky top-10">
        <p className="text-[10px] tracking-[4px] uppercase text-base-content/30 font-bold">Live Preview</p>
        <UserCard
          user={{ firstName, lastName, photoUrl, gender, about, skills, githubUrl, linkedinUrl, twitterUrl }}
          hideMatch={true}
        />
      </div>

    </div>
  );
};

export default EditProfile;
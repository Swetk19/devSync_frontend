import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchConnections(); }, []);

  if (!connections) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-3">
      <div className="loading loading-spinner loading-lg text-primary" />
      <p className="text-base-content/50 text-sm">Fetching connections...</p>
    </div>
  );

  if (connections.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-4">
      <div className="text-5xl">🤝</div>
      <h2 className="text-xl font-bold text-base-content">No connections yet</h2>
      <p className="text-base-content/50 text-sm text-center max-w-xs">
        Start swiping on the feed and connect with developers who match your skills.
      </p>
      <Link to="/feed">
        <button className="btn btn-primary btn-sm mt-2">Go to Feed</button>
      </Link>
    </div>
  );

  return (
    <div className="flex flex-col items-center my-10 gap-4 px-4">
      <h1 className="text-3xl font-bold text-base-content">My Connections</h1>
      {connections.map((connection) => {
        const { _id, firstName, lastName, about, skills, photoUrl } = connection;
        return (
          <div
            key={_id}
            className="flex items-center justify-between gap-4 p-4 rounded-xl w-full md:w-2/3"
            style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
          >
            {/* Left — Avatar + Info */}
            <div className="flex items-center gap-4 flex-1">
              <img
                src={photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                alt={firstName}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <h2 className="font-bold text-lg text-base-content">
                  {firstName} {lastName}
                </h2>
                {about && (
                  <p className="text-base-content/50 text-sm mt-0.5 line-clamp-1">{about}</p>
                )}
                {skills?.length > 0 && (
                  <p className="text-base-content/30 text-xs mt-1">{skills.slice(0, 4).join(", ")}{skills.length > 4 ? ` +${skills.length - 4} more` : ""}</p>
                )}
              </div>
            </div>

            {/* Right — Chat button */}
            <Link to={"/chat/" + _id}>
              <button className="btn btn-primary btn-sm md:btn-md flex-shrink-0">
                💬 Chat
              </button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
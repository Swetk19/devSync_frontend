import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { Link } from "react-router-dom";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

  const reviewRequest = async (status, requestId) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + requestId,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(requestId));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  if (!requests) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-3">
      <div className="loading loading-spinner loading-lg text-primary" />
      <p className="text-base-content/50 text-sm">Fetching requests...</p>
    </div>
  );

  if (requests.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-4">
      <div className="text-5xl">📭</div>
      <h2 className="text-xl font-bold text-base-content">No requests yet</h2>
      <p className="text-base-content/50 text-sm text-center max-w-xs">
        When someone sends you a connection request, it'll show up here.
      </p>
      <Link to="/feed">
      <button className="btn btn-primary btn-sm mt-2">Go to Feed</button>
    </Link>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 16px", gap: "16px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px" }} className="text-base-content">
        Connection Requests
      </h1>

      {requests.map((request) => {
        const sender = request.fromUserId;
        if (!sender) return null;
        const { firstName, lastName, age, gender, about, photoUrl } = sender;

        return (
          <div
            key={request._id}
            style={{
              display: "flex", alignItems: "center", gap: "16px",
              padding: "16px 20px",
              border: "1px solid var(--card-border)",
              background: "var(--card-bg)",
              borderRadius: "12px", width: "100%", maxWidth: "600px",
            }}
          >
            <img
              src={photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
              alt={firstName}
              style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />

            <div style={{ flex: 1 }}>
              <h2 className="text-base-content" style={{ fontWeight: "600", fontSize: "16px", margin: "0 0 4px" }}>
                {firstName} {lastName}
              </h2>
              {age && gender && (
                <p className="text-base-content/50" style={{ fontSize: "13px", margin: "0 0 4px" }}>
                  {age} · {gender}
                </p>
              )}
              {about && (
                <p className="text-base-content/40" style={{
                  fontSize: "12px", margin: 0, overflow: "hidden",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                }}>
                  {about}
                </p>
              )}
            </div>

            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button
                onClick={() => reviewRequest("rejected", request._id)}
                style={{
                  padding: "8px 16px", borderRadius: "8px",
                  border: "1px solid rgba(220,50,50,0.4)",
                  background: "rgba(220,50,50,0.1)", color: "#fc8181",
                  fontSize: "13px", fontWeight: "600", cursor: "pointer",
                }}
                onMouseEnter={(e) => e.target.style.background = "rgba(220,50,50,0.25)"}
                onMouseLeave={(e) => e.target.style.background = "rgba(220,50,50,0.1)"}
              >
                Reject
              </button>
              <button
                onClick={() => reviewRequest("accepted", request._id)}
                style={{
                  padding: "8px 16px", borderRadius: "8px",
                  border: "1px solid rgba(0,200,100,0.4)",
                  background: "rgba(0,200,100,0.1)", color: "#68d391",
                  fontSize: "13px", fontWeight: "600", cursor: "pointer",
                }}
                onMouseEnter={(e) => e.target.style.background = "rgba(0,200,100,0.25)"}
                onMouseLeave={(e) => e.target.style.background = "rgba(0,200,100,0.1)"}
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
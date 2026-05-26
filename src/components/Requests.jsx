import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";

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

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) {
    return (
      <h1 style={{ color: "white", textAlign: "center", marginTop: "40px" }}>
        Loading...
      </h1>
    );
  }

  if (requests.length === 0) {
    return (
      <h1 style={{ color: "white", textAlign: "center", marginTop: "40px" }}>
        No requests found!
      </h1>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 16px", gap: "16px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>
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
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "16px 20px",
              background: "#1a1f2e",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "600px",
            }}
          >
            {/* Avatar */}
            <img
              src={photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
              alt={firstName}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
              }}
            />

            {/* Info */}
            <div style={{ flex: 1 }}>
              <h2 style={{ color: "#fff", fontWeight: "600", fontSize: "16px", margin: "0 0 4px" }}>
                {firstName} {lastName}
              </h2>
              {age && gender && (
                <p style={{ color: "#a0aec0", fontSize: "13px", margin: "0 0 4px" }}>
                  {age} · {gender}
                </p>
              )}
              {about && (
                <p style={{
                  color: "#718096",
                  fontSize: "12px",
                  margin: 0,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}>
                  {about}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button
                onClick={() => reviewRequest("rejected", request._id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid rgba(220,50,50,0.4)",
                  background: "rgba(220,50,50,0.1)",
                  color: "#fc8181",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => e.target.style.background = "rgba(220,50,50,0.25)"}
                onMouseLeave={(e) => e.target.style.background = "rgba(220,50,50,0.1)"}
              >
                Reject
              </button>
              <button
                onClick={() => reviewRequest("accepted", request._id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid rgba(0,200,100,0.4)",
                  background: "rgba(0,200,100,0.1)",
                  color: "#68d391",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.2s",
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
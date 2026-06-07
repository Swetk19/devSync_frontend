import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const ForgotPassword = () => {
  const [emailId, setEmailId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!emailId) return setError("Please enter your email");
    try {
      setLoading(true);
      setError("");
      const res = await axios.post(BASE_URL + "/forgot-password", { emailId });
      setMessage(res.data.message);
      setSent(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200 flex items-center justify-center px-4">
      <div className="card bg-base-100 w-80 shadow-lg border border-base-content/10 rounded-2xl">
        <div className="card-body px-7 py-8 gap-0">

          {/* Header */}
          <div className="text-center mb-5">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center text-2xl mx-auto mb-3">
              🔑
            </div>
            <h1 className="text-xl font-bold text-base-content">Forgot Password</h1>
            <p className="text-base-content/40 text-xs mt-1">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="text-4xl mb-3">📧</div>
              <p className="text-teal-400 text-sm font-medium">{message}</p>
              <p className="text-base-content/40 text-xs mt-2">
                Check your inbox and click the reset link
              </p>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <label className="text-[11px] uppercase tracking-wide text-base-content/50 mb-1.5 block">
                  Email
                </label>
                <input
                  type="email"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  className="input input-bordered input-sm w-full bg-base-200/50 focus:border-teal-400 focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>

              {error && (
                <p className="text-rose-400 text-xs text-center mt-2">{error}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-sm w-full mt-4 bg-teal-500 hover:bg-teal-400 border-none text-white font-semibold"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </>
          )}

          <p className="text-center text-xs text-base-content/40 mt-4">
            Remember your password?{" "}
            <Link to="/login" className="text-teal-400 hover:underline font-medium">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
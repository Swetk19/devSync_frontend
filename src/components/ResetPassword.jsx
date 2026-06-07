import { useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) return setError("Please fill all fields");
    if (newPassword !== confirmPassword) return setError("Passwords do not match");
    if (newPassword.length < 8) return setError("Password must be at least 8 characters");

    try {
      setLoading(true);
      setError("");
      await axios.post(BASE_URL + `/reset-password/${token}`, { newPassword });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid or expired link");
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
              🔒
            </div>
            <h1 className="text-xl font-bold text-base-content">Reset Password</h1>
            <p className="text-base-content/40 text-xs mt-1">
              Enter your new password below
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-teal-400 text-sm font-medium">Password reset successful!</p>
              <p className="text-base-content/40 text-xs mt-2">
                Redirecting to login in 3 seconds...
              </p>
            </div>
          ) : (
            <>
              {/* New Password */}
              <div className="mb-3">
                <label className="text-[11px] uppercase tracking-wide text-base-content/50 mb-1.5 block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input input-bordered input-sm w-full bg-base-200/50 focus:border-teal-400 focus:outline-none pr-9"
                    placeholder="Min 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label className="text-[11px] uppercase tracking-wide text-base-content/50 mb-1.5 block">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input input-bordered input-sm w-full bg-base-200/50 focus:border-teal-400 focus:outline-none"
                  placeholder="Repeat new password"
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
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}

          <p className="text-center text-xs text-base-content/40 mt-4">
            <Link to="/login" className="text-teal-400 hover:underline font-medium">
              Back to Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
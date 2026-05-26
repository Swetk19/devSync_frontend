import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { addUser } from "../utils/userSlice"
import { BASE_URL } from "../utils/constants"

const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [emailId, setEmailId] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [error, setError] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      setError("")
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      )
      dispatch(addUser(res.data))
      navigate("/")
    } catch (err) {
      setError(err?.response?.data || "Something went wrong. Please try again.")
    }
  }

  const handleSignup = async () => {
    try {
      setError("")
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      )
      dispatch(addUser(res.data.data)) // ✅ fixed
      navigate("/profile")
    } catch (err) {
      setError(err?.response?.data || "Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card bg-base-100 w-80 shadow-lg border border-base-content/10 rounded-2xl -mt-16">
        <div className="card-body px-7 py-8 gap-0">

          {/* Header */}
          <div className="text-center mb-5">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center text-2xl mx-auto mb-3">
              👨‍💻
            </div>
            <h1 className="text-xl font-bold text-base-content">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-base-content/40 text-xs mt-1">
              {isLogin ? "Sign in to continue to DevTinder" : "Join DevTinder today"}
            </p>
          </div>

          {/* First Name + Last Name (Signup only) */}
          {!isLogin && (
            <div className="flex gap-2 mb-3">
              <div className="flex-1">
                <label className="text-[11px] uppercase tracking-wide text-base-content/50 mb-1.5 block">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  autoComplete="off"
                  className="input input-bordered input-sm w-full bg-base-200/50 focus:border-teal-400 focus:outline-none"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="text-[11px] uppercase tracking-wide text-base-content/50 mb-1.5 block">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  autoComplete="off"
                  className="input input-bordered input-sm w-full bg-base-200/50 focus:border-teal-400 focus:outline-none"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-3">
            <label className="text-[11px] uppercase tracking-wide text-base-content/50 mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              value={emailId}
              autoComplete="off"
              className="input input-bordered input-sm w-full bg-base-200/50 focus:border-teal-400 focus:outline-none"
              onChange={(e) => setEmailId(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-1">
            <label className="text-[11px] uppercase tracking-wide text-base-content/50 mb-1.5 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              autoComplete="new-password"
              className="input input-bordered input-sm w-full bg-base-200/50 focus:border-teal-400 focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
            {isLogin && (
              <div className="text-right mt-1">
                <a href="#" className="text-[11px] text-teal-400 hover:underline">
                  Forgot password?
                </a>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-rose-400 text-xs text-center mt-3">{error}</p>
          )}

          {/* Submit Button */}
          <button
            className="btn btn-sm w-full mt-4 bg-teal-500 hover:bg-teal-400 border-none text-white font-semibold tracking-wide"
            onClick={isLogin ? handleLogin : handleSignup}
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

          {/* Toggle Login/Signup */}
          <p className="text-center text-xs text-base-content/40 mt-4">
            {isLogin ? "No account?" : "Already have an account?"}{" "}
            <button
              className="text-teal-400 hover:underline font-medium bg-transparent border-none cursor-pointer p-0"
              onClick={() => { setIsLogin(!isLogin); setError("") }}
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login;
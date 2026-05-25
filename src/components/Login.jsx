import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { addUser } from "../utils/userSlice"
import {BASE_URL} from "../utils/constants"

const Login = () => {
  const [emailId, setEmailId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const dispatch = useDispatch()

    const navigate = useNavigate()
  const handleLogin = async () => {
    
    try {
      setError("");
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

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card bg-base-100 w-80 shadow-lg border border-base-content/10 rounded-2xl -mt-16">
        <div className="card-body px-7 py-8 gap-0">

          {/* Header */}
          <div className="text-center mb-5">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center text-2xl mx-auto mb-3">
              👨‍💻
            </div>
            <h1 className="text-xl font-bold text-base-content">Welcome back</h1>
            <p className="text-base-content/40 text-xs mt-1">Sign in to continue to DevTinder</p>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="text-[11px] uppercase tracking-wide text-base-content/50 mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              value={emailId}
              placeholder="you@example.com"
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
              placeholder="••••••••"
              className="input input-bordered input-sm w-full bg-base-200/50 focus:border-teal-400 focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="text-right mt-1">
              <a href="#" className="text-[11px] text-teal-400 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-rose-400 text-xs text-center mt-3">{error}</p>
          )}

          {/* Login Button */}
          <button
            className="btn btn-sm w-full mt-4 bg-teal-500 hover:bg-teal-400 border-none text-white font-semibold tracking-wide"
            onClick={handleLogin}
          >
            Login
          </button>

          {/* Signup Link */}
          <p className="text-center text-xs text-base-content/40 mt-4">
            No account?{" "}
            <a href="/signup" className="text-teal-400 hover:underline font-medium">
              Sign up
            </a>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login
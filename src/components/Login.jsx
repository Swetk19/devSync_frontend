import { useState } from "react"
import axios from "axios"
import { useNavigate, Navigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addUser } from "../utils/userSlice"
import { BASE_URL } from "../utils/constants"
import { Link } from "react-router-dom"

const Login = () => {
  const user = useSelector((store) => store.user)
  const [isLogin, setIsLogin] = useState(true)
  const [emailId, setEmailId] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)  // ✅ NEW
  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (user) return <Navigate to="/profile" />

  const handleLogin = async () => {
    try {
      setError("")
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      )
      dispatch(addUser(res.data))

      const { skills, photoUrl, about } = res.data
      const isDefaultPhoto = photoUrl === "https://geographyandyou.com/images/user-profile.png"
      const isDefaultAbout = about === "Hey there! I'm using DevSync."

      const profileDone = skills?.length > 0 && !isDefaultPhoto && !isDefaultAbout
      navigate(profileDone ? "/feed" : "/profile")

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
      dispatch(addUser(res.data.data))
      navigate("/profile")
    } catch (err) {
      setError(err?.response?.data || "Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-base-200 flex items-center justify-center px-4">
      <div className="card bg-base-100 w-80 shadow-lg border border-base-content/10 rounded-2xl">
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
              {isLogin ? "Sign in to continue to DevSync" : "Join DevSync today"}
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

          {/* Password ✅ with eye icon */}
          <div className="mb-1">
            <label className="text-[11px] uppercase tracking-wide text-base-content/50 mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                autoComplete="new-password"
                className="input input-bordered input-sm w-full bg-base-200/50 focus:border-teal-400 focus:outline-none pr-9"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition"
              >
                {showPassword ? (
                  // Eye Off
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  // Eye
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {isLogin && (
              <div className="text-right mt-1">
                <Link to="/forgot-password" className="text-[11px] text-teal-400 hover:underline">
                    Forgot password?
                </Link>
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
              onClick={() => { setIsLogin(!isLogin); setError(""); setShowPassword(false) }}
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
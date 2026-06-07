import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Provider } from "react-redux"
import Body from "./components/Body"
import Login from "./components/Login"
import Profile from "./components/Profile"
import Feed from "./components/Feed"
import appStore from "./utils/appStore"
import Connections from "./components/Connections"
import Requests from "./components/Requests"
import HomePage from "./components/HomePage"
import Chat from "./components/Chat"
import ForgotPassword from "./components/ForgotPassword"
import ResetPassword from "./components/ResetPassword"

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route element={<Body />}>
            <Route path="/login" element={<Login />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:targetUserId" element={<Chat />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom"; // ✅ removed Navigate
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect, useState } from "react";

const Body = () => {
  const dispatch = useDispatch()
  const userData = useSelector(store => store.user)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  const isChatPage = location.pathname.startsWith("/chat")

  useEffect(() => {
    const fetchUser = async () => {
      if (userData) {
        setLoading(false)
        return;
      }
      try {
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });
        dispatch(addUser(res.data))
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, []) // ✅ fetchUser moved inside useEffect, no warning

  if (loading) return null

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <div className="flex-1 w-full min-w-0">
        <Outlet />
      </div>
      {!isChatPage && <Footer />}
    </div>
  )
}

export default Body
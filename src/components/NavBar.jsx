import { useSelector } from "react-redux";
import {Link} from "react-router-dom";

const NavBar = () => {
    const user = useSelector((store) => store.user)

  return (
    <div className="navbar bg-base-300 shadow-lg px-6">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost tracking-wide text-2xl">
          👨‍💻
          <span className="font-extrabold leading-none">
            <span className="text-teal-300" style={{ fontSize: "22px", top: "-8px" }}>Dev</span>
            <span className="text-rose-400" style={{ fontSize: "32px" }}>Tinder</span>
          </span>
        </Link>
      </div>

      {user && (
        <div className="flex gap-2 items-center">

          {/* Welcome Message */}
          <span className="text-sm text-base-content/70 hidden sm:block">
            Welcome, <span className="text-teal-300 font-semibold">{user.firstName}</span> 👋
          </span>

          {/* Avatar Dropdown */}
          <div className="dropdown dropdown-end mx-3">
            <div tabIndex="0" role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring ring-teal-300 ring-offset-base-100 ring-offset-2">
                <img
                  alt="User Avatar"
                  src={user.photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                />
              </div>
            </div>
            <ul tabIndex="-1" className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow-lg">
              <li>
                <Link to="/profile" className="justify-between">
                  Profile <span className="badge bg-teal-300 text-black border-0">New</span>
                </Link>
              </li>
              <li><a>Settings</a></li>
              <li><a className="text-rose-400">Logout</a></li>
            </ul>
          </div>

        </div>
      )}
    </div>
  )
}

export default NavBar
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { useSelector } from "react-redux";

const Connections = () => {
    const connections = useSelector((store) => store.connections);
    const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      console.log(res.data.data);
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if(!connections) return;
  if(connections.length === 0) return <h1>No connections found!</h1>

  return (
    <div className="flex flex-col items-center my-10 gap-4">
      <h1 className="text-3xl font-bold text-white">My Connections</h1>
      {connections.map((connection) => {
        const { _id, firstName, lastName, about, skills, photoUrl } = connection;
        return (
          <div key={_id} className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg w-2/3">
            <img
              src={photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
              alt={firstName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-white font-bold text-xl">
                {firstName} {lastName}
              </h2>
              <p className="text-gray-400">{about}</p>
              <p className="text-gray-500 text-sm">{skills?.join(", ")}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
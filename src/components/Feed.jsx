import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed && feed.length > 0) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      dispatch(addFeed(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // ✅ handle null, undefined, and empty array
  if (!feed || feed.length === 0) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 64px)",
        color: "rgba(255,255,255,0.4)",
        fontSize: "16px",
      }}>
        No more profiles to show
      </div>
    );
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "calc(100vh - 64px)",
    }}>
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;
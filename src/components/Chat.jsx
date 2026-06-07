import { useState, useEffect, useRef } from "react";
import { createSocketConnection } from "../utils/socket";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [notFriend, setNotFriend] = useState(false);

  const messagesEndRef = useRef(null);
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  // ✅ Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Fetch messages & other user — functions moved inside useEffect
  useEffect(() => {
    if (!targetUserId) return;

    const fetchChatMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
          withCredentials: true,
        });
        const chatMessages = response.data.messages.map((msg) => ({
          _id: msg._id,
          senderId: msg.senderId._id,
          senderName: `${msg.senderId.firstName} ${msg.senderId.lastName}`,
          text: msg.text,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "delivered",
        }));
        setMessages(chatMessages);
      } catch (error) {
        if (error.response?.status === 403) setNotFriend(true);
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchOtherUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/${targetUserId}`, {
          withCredentials: true,
        });
        setOtherUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchChatMessages();
    fetchOtherUser();
  }, [targetUserId]);

  // ✅ Socket connection
  useEffect(() => {
    if (!userId || !targetUserId) return;

    const newSocket = createSocketConnection();
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("joinChat", {
        senderName: `${user.firstName} ${user.lastName}`,
        userId,
        targetUserId,
      });
    });

    newSocket.on("onlineUsers", (onlineUserIds) => {
      setIsOnline(onlineUserIds.includes(targetUserId));
    });

    newSocket.on("receiveMessage", (data) => {
      if (data.userId === userId) return;
      setMessages((prev) => [
        ...prev,
        {
          _id: Date.now(),
          senderId: data.userId,
          senderName: data.senderName || "User",
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "delivered",
        },
      ]);
    });

    newSocket.on("error", (error) => console.error("Socket error:", error));

    return () => newSocket.disconnect();
  }, [userId, targetUserId, user.firstName, user.lastName]);

  // ✅ Early return AFTER all hooks
  if (!targetUserId) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-4">
        <div className="text-6xl">💬</div>
        <h2 className="text-xl font-bold text-base-content">Your Messages</h2>
        <p className="text-base-content/50 text-sm text-center max-w-xs">
          Connect with a developer and start a conversation. Your chats will appear here.
        </p>
        <Link to="/connections">
          <button className="btn btn-primary btn-sm mt-2">Go to Connections</button>
        </Link>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "?";
    return name
      .split(" ")
      .filter((w) => w.length > 0)
      .map((w) => w[0].toUpperCase())
      .join("")
      .slice(0, 2);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || notFriend) return;
    if (!socket) { alert("Socket not connected"); return; }

    const messageText = newMessage;
    setNewMessage("");
    setIsSending(true);

    setMessages((prev) => [
      ...prev,
      {
        _id: Date.now(),
        senderId: userId,
        senderName: `${user.firstName} ${user.lastName}`,
        text: messageText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "sent",
      },
    ]);

    socket.emit("sendMessage", {
      senderName: `${user.firstName} ${user.lastName}`,
      userId, targetUserId, text: messageText,
    });

    try {
      await axios.post(
        `${BASE_URL}/chat/${targetUserId}/message`,
        { text: messageText },
        { withCredentials: true }
      );
    } catch (error) {
      if (error.response?.status === 403) setNotFriend(true);
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isSending) handleSend();
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-3">
      <div className="loading loading-spinner loading-lg text-primary" />
      <p className="text-base-content/50 text-sm">Loading chat...</p>
    </div>
  );

  if (notFriend) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-4">
      <div className="text-5xl">🔒</div>
      <h2 className="text-xl font-bold text-base-content">You're not connected</h2>
      <p className="text-base-content/50 text-sm text-center max-w-xs">
        You can only chat with developers you're connected with. Send them a connection request first!
      </p>
      <Link to="/feed">
        <button className="btn btn-primary btn-sm mt-2">Go to Feed</button>
      </Link>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-base-100">

      {/* Header */}
      <div className="flex items-center gap-4 p-4 md:p-6 border-b border-base-300 bg-base-200 sticky top-0 z-10">
        <div className="relative">
          <div className="avatar placeholder">
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
              <span className="font-bold text-lg">
                {otherUser ? getInitials(`${otherUser.firstName} ${otherUser.lastName}`) : "?"}
              </span>
            </div>
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-base-200 rounded-full" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">
            {otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Unknown User"}
          </h3>
          <p className={`text-sm ${isOnline ? "text-green-500 font-semibold" : "text-base-content/60"}`}>
            {isOnline ? "🟢 Online" : "Offline"}
          </p>
        </div>
        <button className="btn btn-ghost btn-circle btn-sm md:btn-md">📞</button>
        <button className="btn btn-ghost btn-circle btn-sm md:btn-md">⋮</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 pb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="text-4xl">👋</div>
            <p className="text-base-content/50 text-sm">
              No messages yet. Say hi to {otherUser?.firstName || "them"}!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className={`chat ${msg.senderId === userId ? "chat-end" : "chat-start"}`}>
              <div className="chat-image avatar placeholder">
                <div className={`w-10 h-10 rounded-full font-bold text-white flex items-center justify-center ${
                  msg.senderId === userId
                    ? "bg-gradient-to-br from-orange-400 to-red-500"
                    : "bg-gradient-to-br from-blue-500 to-purple-500"
                }`}>
                  <span>{getInitials(msg.senderName)}</span>
                </div>
              </div>
              <div>
                <div className="chat-header mb-1">
                  <span className="font-semibold">{msg.senderName}</span>
                  <time className="text-xs opacity-50 ml-2">{msg.timestamp}</time>
                </div>
                <div className={`chat-bubble break-words ${msg.senderId === userId ? "chat-bubble-primary" : ""}`}>
                  {msg.text}
                </div>
                <div className="chat-footer opacity-50 text-xs mt-1">
                  {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 md:p-6 border-t border-base-300 bg-base-200">
        <div className="flex gap-3">
          <button className="btn btn-ghost btn-circle btn-sm md:btn-md">📎</button>
          <input
            type="text"
            placeholder={`Message ${otherUser ? otherUser.firstName : "..."}`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSending}
            className="input input-bordered input-sm md:input-md flex-1"
          />
          <button
            onClick={handleSend}
            disabled={isSending || !newMessage.trim()}
            className="btn btn-primary btn-sm md:btn-md"
          >
            {isSending ? "..." : "Send"}
          </button>
        </div>
      </div>

    </div>
  );
};

export default Chat;
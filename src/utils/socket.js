import io from "socket.io-client";

export const createSocketConnection = () => {
    return io("http://localhost:3000", {
        withCredentials: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
    });
};
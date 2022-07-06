import React, { createContext } from 'react';
import { io, Socket } from "socket.io-client";

const URL = "http://localhost:3000";
const socket = io(URL, { autoConnect: false })
// SocketContext = createContext<Socket>(socket);

socket.onAny((event, ...args) => {
});

export default socket;

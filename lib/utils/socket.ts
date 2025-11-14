'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (typeof window === 'undefined') {
    throw new Error('Socket can only be used on the client side');
  }

  if (!socket) {
    const URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
    socket = io(URL, { autoConnect: false });
    
    socket.onAny((event, ...args) => {
      console.log('Socket event:', event, args);
    });
  }

  return socket;
};

export default getSocket;


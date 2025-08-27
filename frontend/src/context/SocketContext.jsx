import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  // Use Vite env var if provided, else default to backend URL
  const SERVER_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    const socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: true, // Ensure a new connection on each mount
    });

    socketRef.current = socket;

    const setupListeners = (s) => {
      s.on('connect', () => {
        console.log('Socket connected', s.id);
        setConnected(true);
      });

      s.on('disconnect', (reason) => {
        console.log('Socket disconnected', reason);
        setConnected(false);
      });

      s.on('connect_error', (err) => {
        console.error('Socket connect_error:', err.message || err);
      });

      s.on('pong', () => {
        console.log('Received pong from server');
      });
    };

    setupListeners(socket);

    // Test connection with ping
    socket.emit('ping', (response) => {
      console.log('Ping response:', response);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        console.log('SocketProvider: Disconnected');
      }
    };
  }, [SERVER_URL]);

  const sendMessage = useCallback((eventName, payload) => {
    if (!socketRef.current || !connected) {
      console.warn('Socket not connected. Cannot emit', eventName);
      return;
    }
    socketRef.current.emit(eventName, payload);
  }, [connected]);

  const subscribe = useCallback((eventName, handler) => {
    if (!socketRef.current) {
      console.warn('Socket not initialized. Cannot subscribe', eventName);
      return () => {};
    }
    socketRef.current.on(eventName, handler);
    return () => {
      if (socketRef.current) socketRef.current.off(eventName, handler);
    };
  }, []);

  const value = {
    sendMessage,
    subscribe,
    connected,
    socket: socketRef.current,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
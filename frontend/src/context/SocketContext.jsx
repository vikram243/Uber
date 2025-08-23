import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  // Use Vite env var if provided, else default to backend URL
  const SERVER_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

  useEffect(() => {
    console.log('SocketProvider: connecting to', SERVER_URL);

    const socket = io(SERVER_URL, {
      transports: ['websocket'],
      withCredentials: true,
      reconnectionAttempts: 5,
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
        console.error('Socket connect_error', err);
        // If websocket fails, fallback to polling
        if (s.io?.opts?.transports?.includes('websocket')) {
          console.log('SocketProvider: websocket failed, falling back to polling');
          try {
            s.disconnect();
          } catch (e) {
            console.warn('Error disconnecting failed websocket socket', e);
          }
          const fallback = io(SERVER_URL, {
            transports: ['polling'],
            withCredentials: true,
            reconnectionAttempts: 5,
          });
          socketRef.current = fallback;
          setupListeners(fallback);
        }
      });
    };

    setupListeners(socket);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        console.log('SocketProvider: disconnected');
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
import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext(null)

// SocketProvider component to manage socket connection and provide context
// This component handles the connection to the server, manages the socket state,
const SocketProvider = ({ children }) => {
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)

  // Use Vite env var if set, otherwise default to current origin.
  const SERVER_URL = import.meta.env.VITE_BASE_URL || window.location.origin

  useEffect(() => {
    console.log('SocketProvider: connecting to', SERVER_URL)

    // Try websocket first; if connect_error occurs, fallback to long-polling
    let socket = io(SERVER_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
    })
    socketRef.current = socket

    // Setup listeners for socket events
    const setupListeners = (s) => {
      s.on('connect', () => {
        console.log('Socket connected', s.id)
        setConnected(true)
      })

      // Handle disconnection
      s.on('disconnect', (reason) => {
        console.log('Socket disconnected', reason)
        setConnected(false)
      })

      // Handle connection errors
      s.on('connect_error', (err) => {
        console.error('Socket connect_error', err)
        // If websocket transport fails, try polling as a safer fallback
        const triedWebsocket = s.io && s.io.opts && Array.isArray(s.io.opts.transports) && s.io.opts.transports.includes('websocket')
        if (triedWebsocket) {
          console.log('SocketProvider: websocket failed, falling back to polling transport')
          try {
            s.disconnect()
          } catch (e) {
            console.warn('Error disconnecting failed websocket socket', e)
          }
          socket = io(SERVER_URL, { transports: ['polling'], reconnectionAttempts: 5 })
          socketRef.current = socket
          setupListeners(socket)
        }
      })
    }
    setupListeners(socket)

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        console.log('SocketProvider: disconnected')
      }
    }
  }, [SERVER_URL])

  // emit to a specific event name
  const sendMessage = useCallback((eventName, payload) => {
    if (!socketRef.current || !connected) {
      console.warn('Socket not connected. Cannot emit', eventName)
      return
    }
    socketRef.current.emit(eventName, payload)
  }, [connected])

  // subscribe to an event name; returns an unsubscribe function
  const subscribe = useCallback((eventName, handler) => {
    if (!socketRef.current) {
      console.warn('Socket not initialized. Cannot subscribe', eventName)
      return () => {}
    }
    socketRef.current.on(eventName, handler)
    return () => {
      if (socketRef.current) socketRef.current.off(eventName, handler)
    }
  }, [])

  // Context value to be provided to children components
  // This includes sendMessage, subscribe, and the connected state
  const value = {
    sendMessage,
    subscribe,
    connected,
    // socket is included for advanced usage but is not required
    socket: socketRef.current,
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export default SocketProvider
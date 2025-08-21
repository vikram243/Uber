import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext(null)

const SocketProvider = ({ children }) => {
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)

  // Use Vite env var if set, otherwise default to current origin.
  const SERVER_URL = import.meta.env.VITE_BASE_URL || window.location.origin

  useEffect(() => {
    console.log('SocketProvider: connecting to', SERVER_URL)
    const socket = io(SERVER_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Socket connected', socket.id)
      setConnected(true)
    })

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected', reason)
      setConnected(false)
    })

    socket.on('connect_error', (err) => {
      console.error('Socket connect_error', err)
    })

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
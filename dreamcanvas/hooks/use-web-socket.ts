'use client'

import { useState, useEffect, useCallback } from 'react'

export function useWebSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null)

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000')
    setSocket(ws)

    ws.onmessage = (event) => {
      setLastMessage(event)
    }

    return () => {
      ws.close()
    }
  }, [])

  const sendMessage = useCallback((message: string) => {
    if (socket) {
      socket.send(message)
    }
  }, [socket])

  return { sendMessage, lastMessage }
}


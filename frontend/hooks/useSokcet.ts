// hooks/useSocket.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8081';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const socket = io(BACKEND_URL, {
      withCredentials: true
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('userTyping', (data) => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000); // Reset after 2s
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (messageData: any) => {
    socketRef.current?.emit('sendMessage', messageData);
  };

  const emitTyping = (username: string) => {
    socketRef.current?.emit('typing', { username });
  };

  return {
    socket: socketRef.current,
    sendMessage,
    emitTyping,
    messages,
    isTyping
  };
};

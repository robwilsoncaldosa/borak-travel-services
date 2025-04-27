'use client';

import { useState, useEffect } from 'react';
import { ChatContext, ChatMessage, NewChatMessage } from '@/lib/chat-context';
import { chatApi } from '@/lib/backend_api/chat';
import io from 'socket.io-client';

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const addMessage = async (newMessage: NewChatMessage) => {
    try {
      const messagePayload = {
        ...newMessage,
        message: newMessage.text, // Map text to message for backend compatibility
        timestamp: new Date(),
        isRead: false,
        isAdmin: false
      };

      const data = await chatApi.createMessage(messagePayload);
      setMessages(prev => [...prev, { ...data, timestamp: new Date(data.timestamp), text: data.message || '' } as ChatMessage]);
      socket?.emit('sendMessage', data);
    } catch (error) {
      console.error('Failed to add message:', error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await chatApi.getAllMessages();
        const formattedMessages = data.map(msg => ({
          ...msg,
          text: msg.message || msg.text || '',
          message: msg.message || msg.text || '',
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages.map(msg => ({
          ...msg,
          isAdmin: msg.isAdmin || false // Ensure isAdmin is always boolean
        })) as ChatMessage[]);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();

    if (socket) {
      socket.on('message', (message: ChatMessage) => {
        setMessages(prev => {
          const exists = prev.some(m => m.id === message.id);
          if (!exists) {
            return [...prev, {
              ...message,
              text: message.message || message.text || '',
              message: message.message || message.text || '',
              timestamp: new Date(message.timestamp)
            }];
          }
          return prev;
        });
      });
    }
  }, [socket]);

  return (
    <ChatContext.Provider value={{ messages, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
}
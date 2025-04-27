import React from 'react';
import { createContext, useContext } from 'react';

export interface ChatMessage {
  message: string;
  isAdmin: boolean;
  id?: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  isSpecialOffer?: boolean;
  userId?: string;
  username?: string;
}

export type NewChatMessage = Omit<ChatMessage, 'id'>;

export interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (message: NewChatMessage) => Promise<void>;
}

export const ChatContext = React.createContext<ChatContextType>({
  messages: [],
  addMessage: async () => {},
});
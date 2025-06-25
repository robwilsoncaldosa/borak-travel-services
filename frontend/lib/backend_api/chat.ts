import { BookingFormData } from '@/components/BookingForm';
import { instance } from '../axios';

export interface ChatMessage {
  id?: string;
  sender: "user" | "bot";
  text?: string;
  message?: string; 
  timestamp: Date | string;
  isSpecialOffer?: boolean;
  isRead?: boolean;
  isAdmin?: boolean;
  userId?: string;
  username?: string;
  guestUsername?: string;
  imageUrls?: string[];
}




export const chatApi = {
  // User & Admin: Get messages by user ID
  getMessagesByUserId: async (userId: string) => {
    try {
      if (!userId) {
        console.error('No userId provided');
        return [];
      }

      const { data } = await instance.get<ChatMessage[]>(`/api/messages/${userId}`);
      
      // Ensure we return an array even if data is null/undefined
      return Array.isArray(data) ? data : [];
    } catch (error) {
      // Type guard to check if error is an AxiosError
      if (error instanceof Error && 'response' in error && typeof error.response === 'object' && error.response && 'status' in error.response && error.response.status === 404) {
        return []; // Return empty array for new users
      }
      console.error('Failed to fetch messages:', error);
      return []; // Return empty array on error
    }
  },
  // User & Admin: Create new message
  createMessage: async (message: Omit<ChatMessage, 'id'>) => {
    try {
      // Transform the message format to match backend requirements
      const messagePayload = {
        message: message.message || message.text, // Use message field first, fallback to text
        userId: message.userId,  // Using guest's ID
        username: message.username || (message.sender === 'bot' ? 'Bot' : 'Guest'), // Using guest's username
        isAdmin: message.sender === 'bot',
        isRead: message.sender === 'bot',
        isSpecialOffer: message.isSpecialOffer || false,
        timestamp: message.timestamp || new Date(),
        imageUrls: message.imageUrls
      };

      const { data } = await instance.post<ChatMessage>('/api/messages/create', messagePayload);
      return data;
    } catch (error) {
      console.error('Failed to create message:', error);
      throw error;
    }
  },

  // Admin: Get all messages
  getAllMessages: async () => {
    try {
      const { data } = await instance.get<ChatMessage[]>('/api/messages');
      return data;
    } catch (error) {
      console.error('Failed to fetch all messages:', error);
      throw error;
    }
  },

  // Admin: Send reply
  sendReply: async (userId: string, message: string, imageUrls?: string[]) => {
    try {
      const { data } = await instance.post<ChatMessage>('/api/messages/reply', {
        userId,
        message,
        isAdmin: true,
        imageUrls: imageUrls || []
      });
      return data;
    } catch (error) {
      console.error('Failed to send reply:', error);
      throw error;
    }
  },

  // Admin: Mark message as read
  markAsRead: async (messageId: string) => {
    try {
      const { data } = await instance.patch(`/api/messages/${messageId}/read`);
      return data;
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      throw error;
    }
  },

  createBooking: async (bookingData: BookingFormData): Promise<void> => {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      throw new Error("Failed to create booking");
    }
  },
};
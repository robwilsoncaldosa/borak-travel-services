//backend/src/controllers/messageController.ts:

import { Request, Response } from 'express';
import MessageModel, { IMessage } from '../models/messageModel';

export const messageController = {
  getAllMessages: async (req: Request, res: Response) => {
    try {
      const messages = await MessageModel.find();
      // Sort by timestamp descending (newest first)
      const sortedMessages = messages.sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return timeB - timeA;
      });
      res.status(200).json(sortedMessages || []);
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Failed to fetch messages',
      });
    }
  },

  createMessage: async (req: Request, res: Response) => {
    try {
      const { message, username, userId, isAdmin = false, imageUrls = [] } = req.body;

      if (!message || !userId) {
        return res.status(400).json({ message: 'Message and userId are required' });
      }

      const finalUsername = isAdmin ? 'Bot' : username || 'Guest';

      const savedMessage = await MessageModel.create({
        userId,
        username: finalUsername,
        message,
        isRead: isAdmin, 
        isAdmin,
        imageUrls
      });

      // Emit the message in real-time
      if (req.io) {
        req.io.emit('message', savedMessage);
      } else {
        console.error('Socket.io instance is not available');
      }

      res.status(201).json(savedMessage);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Failed to create message',
        error: error instanceof Error ? error.stack : error,
      });
    }
  },

  replyToMessage: async (req: Request, res: Response) => {
    try {
      const { userId, message, adminName, imageUrls = [] } = req.body;

      // Debugging line to check if req.io exists
      console.log(req.io);

      const savedMessage = await MessageModel.create({
        userId,
        username: adminName || 'Bot',
        message,
        isRead: true,
        isAdmin: true,
        imageUrls
      });

      // Ensure req.io exists before emitting
      if (req.io) {
        req.io.emit('message', savedMessage);  // Emit admin reply to all connected clients
      } else {
        console.error('Socket.io instance is not available');
      }

      // Mark all unread guest messages as read
      await MessageModel.updateMany(
        { userId, isRead: false },
        { isRead: true }
      );

      res.status(201).json(savedMessage);
    } catch (error) {
      console.error('Error handling reply:', error);
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Failed to send reply',
      });
    }
  },

  getMessagesByUserId: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      console.log('Fetching messages for userId:', userId);
      const messages = await MessageModel.find({ userId });
      console.log('Found messages:', messages.length);
      
      // Sort by timestamp ascending (oldest first)
      const sortedMessages = messages.sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return timeA - timeB;
      });
      
      res.status(200).json(sortedMessages);
    } catch (error) {
      console.error('Error in getMessagesByUserId:', error);
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Failed to fetch messages',
        error: error instanceof Error ? error.stack : String(error),
      });
    }
  },

  markAsRead: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      await MessageModel.updateMany(
        { userId, isRead: false },
        { isRead: true }
      );

      res.status(200).json({ message: 'Messages marked as read' });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Failed to update messages',
      });
    }
  },
};

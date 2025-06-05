//backend/src/controllers/messageController.ts:

import { Request, Response } from 'express';
import Message, { IMessage } from '../models/messageModel';

export const messageController = {
  getAllMessages: async (req: Request, res: Response) => {
    try {
      const messages = await Message.find().sort({ timestamp: -1 });
      res.status(200).json(messages || []);
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

      const newMessage = new Message({
        userId,
        username: finalUsername,
        message,
        timestamp: new Date(),
        isRead: isAdmin, 
        isAdmin,
        imageUrls
      });

      const savedMessage = await newMessage.save();

      // Emit the message in real-time
      if (req.io) {
        req.io.emit('message', savedMessage);
      } else {
        console.error('Socket.io instance is not available');
      }

      res.status(201).json(savedMessage);
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Failed to create message',
      });
    }
  },

  replyToMessage: async (req: Request, res: Response) => {
    try {
      const { userId, message, adminName, imageUrls = [] } = req.body;

      // Debugging line to check if req.io exists
      console.log(req.io);

      const newMessage = new Message({
        userId,
        username: adminName || 'Bot',
        message,
        timestamp: new Date(),
        isRead: true,
        isAdmin: true,
        imageUrls
      });

      const savedMessage = await newMessage.save();

      // Ensure req.io exists before emitting
      if (req.io) {
        req.io.emit('message', savedMessage);  // Emit admin reply to all connected clients
      } else {
        console.error('Socket.io instance is not available');
      }

      // Mark all unread guest messages as read
      await Message.updateMany(
        { userId, isRead: false, isAdmin: false },
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
      const messages = await Message.find({ userId }).sort({ timestamp: 1 });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Failed to fetch messages',
      });
    }
  },

  markAsRead: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      await Message.updateMany(
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

import { Request, Response } from 'express';
import Message, { IMessage } from '../models/messageModel';

export const messageController = {
    getAllMessages: async (req: Request, res: Response) => {
        try {
          const messages = await Message.find({ username: { $ne: 'Bot' } }).sort({ timestamp: -1 });
          res.status(200).json(messages || []);
        } catch (error) {
          res.status(500).json({
            message: error instanceof Error ? error.message : 'Failed to fetch messages',
          });
        }
      },
      

  createMessage: async (req: Request, res: Response) => {
    try {
      const { message, username = 'Guest' } = req.body;
      const userId = Date.now().toString(); // Generate temporary userId for guest

      const newMessage = new Message({
        userId,
        username,
        message,
        timestamp: new Date(),
        isRead: false,
        isAdmin: false
      });
      
      const savedMessage = await newMessage.save();
      res.status(201).json(savedMessage);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to create message' });
    }
  },

  replyToMessage: async (req: Request, res: Response) => {
    try {
      const { userId, message, adminName } = req.body;
      console.log("userId : ", userId)
      const newMessage = new Message({
        userId, // Using the same userId to maintain conversation thread
        username: adminName || 'Bot',
        message,
        timestamp: new Date(),
        isRead: true,
        isAdmin: true
      });
      
      const savedMessage = await newMessage.save();

      // Mark the original message as read
      await Message.findOneAndUpdate(
        { userId, isAdmin: false },
        { isRead: true }
      );
      
      res.status(201).json(savedMessage);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to send reply' });
    }
  },

  getMessagesByUserId: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const messages = await Message.find({ userId }).sort({ timestamp: 1 });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to fetch messages' });
    }
  },

  markAsRead: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const messages = await Message.updateMany(
        { userId, isRead: false },
        { isRead: true }
      );
      
      res.status(200).json({ message: 'Messages marked as read' });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to update messages' });
    }
  }
};
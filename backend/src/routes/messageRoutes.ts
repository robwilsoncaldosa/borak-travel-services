import express, { Request, Response, NextFunction } from 'express';
import { messageController } from '../controllers/messageController';
import { isLoggedIn } from '../lib/users';

interface AuthRequest extends Request {
  user?: any; // Update this type according to your user model
}

const router = express.Router();

// Public routes - for customer chat messages
router.post('/create', messageController.createMessage);
router.get('/:userId', messageController.getMessagesByUserId);

// Protected routes - only for admin
router.get('/', messageController.getAllMessages); // Changed from getAllMessage to getAll
router.patch('/:messageId/read', messageController.markAsRead);
router.post('/reply',  messageController.replyToMessage);

// Catch undefined routes
router.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

export default router;
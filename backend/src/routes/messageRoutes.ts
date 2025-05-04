//backend/src/routes/messageRoutes.ts:

import express, { Request, Response, NextFunction } from 'express';
import { messageController } from '../controllers/messageController';
import { isLoggedIn } from '../lib/users';

interface AuthRequest extends Request {
  user?: any; // Update this type according to your user model
}

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const router = express.Router();

// Public routes - for customer chat messages
router.post('/create', asyncHandler(messageController.createMessage));


router.get('/:userId', messageController.getMessagesByUserId);

// Protected routes - only for admina
router.get('/', messageController.getAllMessages); // Changed from getAllMessage to getAll
router.patch('/:messageId/read', messageController.markAsRead);
router.post('/reply',  messageController.replyToMessage);

// Catch undefined routes
router.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

export default router;
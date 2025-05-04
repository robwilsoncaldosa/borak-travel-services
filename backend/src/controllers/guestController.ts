import GuestUser from '../models/guestModel';
import { Request, Response } from 'express';

class GuestController {
  static async createGuestUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, email } = req.body;
  
      if (!username || !email) {
        res.status(400).json({ message: 'Username and email are required' });
        return;
      }
  
      // Check if email is already in use
      const existingGuest = await GuestUser.findOne({ email });
      if (existingGuest) {
        // Return existing guest's ID if found
        res.status(200).json({
          id: existingGuest._id,
          username: existingGuest.username,
          email: existingGuest.email,
          message: 'Guest already exists'
        });
        return;
      }
  
      // Create new guest if not found
      const guest = new GuestUser({ 
        username,
        email
      });
      await guest.save();
      
      // Return the created guest with MongoDB's _id
      res.status(201).json({
        id: guest._id,
        username: guest.username,
        email: guest.email,
        message: 'Guest created successfully'
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to create guest user' 
      });
    }
  }
}

export { GuestController };




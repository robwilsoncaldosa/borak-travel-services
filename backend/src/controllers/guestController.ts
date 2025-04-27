import GuestUser from '../models/guestModel';
import { Request, Response } from 'express';
export const createGuestUser = async (req: Request, res: Response) => {
  try {
    const { username, emailOrPhone, userId } = req.body;

    if (!username || !emailOrPhone || !userId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await GuestUser.findOne({ userId });
    if (existing) return res.status(200).json(existing);

    const guest = new GuestUser({ 
      username, 
      contact: emailOrPhone, // Map emailOrPhone to contact field
      userId 
    });
    await guest.save();
    res.status(201).json(guest);
  } catch (error) {
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Failed to create guest user' 
    });
  }
};

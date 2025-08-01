import GuestUser from '../models/guestModel';
import { Request, Response } from 'express';

class GuestController {
  static async createGuestUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, firstname, middlename, lastname, mobile } = req.body;
  
      if (!username || !email) {
        res.status(400).json({ message: 'Username and email are required' });
        return;
      }
  
      // Check if email is already in use
      const existingGuest = await GuestUser.findOne({ email });
      if (existingGuest) {
        // Update existing guest with new information if provided
        const updateData: any = {};
        if (firstname !== undefined) updateData.firstname = firstname;
        if (middlename !== undefined) updateData.middlename = middlename;
        if (lastname !== undefined) updateData.lastname = lastname;
        if (mobile !== undefined) updateData.mobile = mobile;
        
        if (Object.keys(updateData).length > 0) {
          await GuestUser.findByIdAndUpdate(existingGuest._id, updateData);
          const updatedGuest = await GuestUser.findById(existingGuest._id);
          
          res.status(200).json({
            id: updatedGuest!._id,
            username: updatedGuest!.username,
            email: updatedGuest!.email,
            firstname: updatedGuest!.firstname,
            middlename: updatedGuest!.middlename,
            lastname: updatedGuest!.lastname,
            mobile: updatedGuest!.mobile,
            message: 'Guest updated successfully'
          });
          return;
        }
        
        // Return existing guest's ID if no updates needed
        res.status(200).json({
          id: existingGuest._id,
          username: existingGuest.username,
          email: existingGuest.email,
          firstname: existingGuest.firstname,
          middlename: existingGuest.middlename,
          lastname: existingGuest.lastname,
          mobile: existingGuest.mobile,
          message: 'Guest already exists'
        });
        return;
      }
  
      // Create new guest if not found
      const guest = new GuestUser({ 
        username,
        email,
        firstname,
        middlename,
        lastname,
        mobile
      });
      await guest.save();
      
      // Return the created guest with MongoDB's _id
      res.status(201).json({
        id: guest._id,
        username: guest.username,
        email: guest.email,
        firstname: guest.firstname,
        middlename: guest.middlename,
        lastname: guest.lastname,
        mobile: guest.mobile,
        message: 'Guest created successfully'
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to create guest user' 
      });
    }
  }

  static async getGuestById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log('getGuestById called with id:', id);
      const guest = await GuestUser.findById(id);
      console.log('Found guest:', guest);
      
      if (!guest) {
        console.log('Guest not found for id:', id);
        res.status(404).json({ message: 'Guest not found' });
        return;
      }
      
      console.log('Returning guest data:', {
        id: guest._id,
        username: guest.username,
        email: guest.email,
        firstname: guest.firstname,
        middlename: guest.middlename,
        lastname: guest.lastname,
        mobile: guest.mobile
      });
      res.status(200).json({
        id: guest._id,
        username: guest.username,
        email: guest.email,
        firstname: guest.firstname,
        middlename: guest.middlename,
        lastname: guest.lastname,
        mobile: guest.mobile
      });
    } catch (error) {
      console.error('Error in getGuestById:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to fetch guest' 
      });
    }
  }
  
  static async getAllGuests(req: Request, res: Response): Promise<void> {
    try {
      const guests = await GuestUser.find();
      const formattedGuests = guests.map(guest => ({
        id: guest._id,
        username: guest.username,
        email: guest.email,
        firstname: guest.firstname,
        middlename: guest.middlename,
        lastname: guest.lastname,
        mobile: guest.mobile
      }));
      
      res.status(200).json(formattedGuests);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to fetch guests' 
      });
    }
  }

  static async updateGuestUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { firstname, middlename, lastname, mobile } = req.body;

      const guest = await GuestUser.findById(id);
      if (!guest) {
        res.status(404).json({ message: 'Guest not found' });
        return;
      }

      // Update only the provided fields
      const updateData: any = {};
      if (firstname !== undefined) updateData.firstname = firstname;
      if (middlename !== undefined) updateData.middlename = middlename;
      if (lastname !== undefined) updateData.lastname = lastname;
      if (mobile !== undefined) updateData.mobile = mobile;

      const updatedGuest = await GuestUser.findByIdAndUpdate(
        id, 
        updateData, 
        { new: true }
      );

      res.status(200).json({
        id: updatedGuest!._id,
        username: updatedGuest!.username,
        email: updatedGuest!.email,
        firstname: updatedGuest!.firstname,
        middlename: updatedGuest!.middlename,
        lastname: updatedGuest!.lastname,
        mobile: updatedGuest!.mobile,
        message: 'Guest updated successfully'
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to update guest' 
      });
    }
  }
}

export { GuestController };




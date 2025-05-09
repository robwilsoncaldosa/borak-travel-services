import { Request, Response } from 'express';
import Booking, { IBooking } from '../models/bookingModel';

export const bookingController = {
  getAllBookings: async (_req: Request, res: Response): Promise<void> => {
    try {
      const bookings = await Booking.find();
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  },

  getBookingById: async (req: Request, res: Response): Promise<void> => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        res.status(404).json({ message: 'Booking not found' });
        return;
      }
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch booking' });
    }
  },

  createBooking: async (req: Request, res: Response): Promise<void> => {
    try {
      const booking = new Booking(req.body);
      const saved = await booking.save();
      res.status(201).json(saved);
    } catch (error) {
      res.status(400).json({ message: 'Failed to create booking' });
    }
  },

  updateBooking: async (req: Request, res: Response): Promise<void> => {
    try {
      const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) {
        res.status(404).json({ message: 'Booking not found' });
        return;
      }
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ message: 'Failed to update booking' });
    }
  },

  deleteBooking: async (req: Request, res: Response): Promise<void> => {
    try {
      const deleted = await Booking.findByIdAndDelete(req.params.id);
      if (!deleted) {
        res.status(404).json({ message: 'Booking not found' });
        return;
      }
      res.status(200).json({ message: 'Booking deleted' });
    } catch (error) {
      res.status(400).json({ message: 'Failed to delete booking' });
    }
  }
};
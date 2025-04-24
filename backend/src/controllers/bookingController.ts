import { Request, Response, RequestHandler } from 'express';
import Booking from '../models/bookingModel';

export const bookingController = {
  getAllBookings: (async (req: Request, res: Response) => {
    try {
      const bookings = await Booking.find();
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  }) as RequestHandler,

  getBookingById: (async (req: Request, res: Response) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  }) as RequestHandler,

  getUserBookings: (async (req: Request, res: Response) => {
    try {
      const bookings = await Booking.find({ user_id: req.params.userId });
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  }) as RequestHandler,

  createBooking: (async (req: Request, res: Response) => {
    try {
      const booking = new Booking(req.body);
      const newBooking = await booking.save();
      res.status(201).json(newBooking);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  }) as RequestHandler,

  updateBooking: (async (req: Request, res: Response) => {
    try {
      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.status(200).json(booking);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  }) as RequestHandler,

  deleteBooking: (async (req: Request, res: Response) => {
    try {
      const booking = await Booking.findByIdAndDelete(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  }) as RequestHandler
};
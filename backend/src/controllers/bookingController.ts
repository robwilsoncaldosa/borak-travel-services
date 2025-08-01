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
      const {
        user_id,
        package_id,
        destination,
        pickup_location,
        pickup_date,
        pickup_time,
        return_date,
        return_time,
        status,
        payment_status,
        packs,
        price,
        paid_amount,
      } = req.body;

      // Validate required fields
      if (
        !user_id ||
        !package_id ||
        !destination ||
        !pickup_location ||
        !pickup_date ||
        !pickup_time ||
        !return_date ||
        !return_time ||
        !packs
      ) {
        res.status(400).json({ message: "Missing required fields" });
        return; // Ensure the method returns void
      }

      // Validate data types
      if (typeof packs !== "number" || packs < 1) {
        res.status(400).json({ message: "Invalid number of packs" });
        return; // Ensure the method returns void
      }
      if (price !== null && (typeof price !== "number" || price < 0)) {
        res.status(400).json({ message: "Invalid price" });
        return;
      }
      if (paid_amount !== null && (typeof paid_amount !== "number" || paid_amount < 0)) {
        res.status(400).json({ message: "Invalid paid amount" });
        return;
      }

      // Combine date and time strings into Date objects
      console.log('Received date/time values:', {
        pickup_date,
        pickup_time,
        return_date,
        return_time
      });
      
      const pickupDateTime = new Date(`${pickup_date}T${pickup_time}`);
      const returnDateTime = new Date(`${return_date}T${return_time}`);
      
      console.log('Combined date/time objects:', {
        pickupDateTime: pickupDateTime.toISOString(),
        returnDateTime: returnDateTime.toISOString()
      });
      
      // Validate that the dates are valid
      if (isNaN(pickupDateTime.getTime())) {
        res.status(400).json({ message: "Invalid pickup date and time" });
        return;
      }
      if (isNaN(returnDateTime.getTime())) {
        res.status(400).json({ message: "Invalid return date and time" });
        return;
      }

      // Create booking in the database
      const booking = new Booking({
        user_id,
        package_id,
        destination,
        pickup_location,
        pickup_date: pickupDateTime,
        return_date: returnDateTime,
        status: status || "PENDING", // Default to "PENDING"
        payment_status: payment_status || "PENDING", // Default to "PENDING"
        packs,
        price,
        paid_amount,
      });

      const saved = await booking.save();
      res.status(201).json(saved);
      return; // Ensure the method returns void
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
      return; // Ensure the method returns void
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
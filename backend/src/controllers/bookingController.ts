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
  },

  // Send booking receipt to guest's email
  sendReceiptEmail: async (req: Request, res: Response): Promise<void> => {
    try {
      const bookingId = req.params.id;
      console.log('[sendReceiptEmail] bookingId:', bookingId);
      const BookingModel = require('../models/bookingModel').default;
      const GuestUser = require('../models/guestModel').default;
      const EmailService = require('../services/emailService').default;

      // Find booking
      const booking = await BookingModel.findById(bookingId);
      console.log('[sendReceiptEmail] booking:', booking);
      if (!booking) {
        console.log('[sendReceiptEmail] Booking not found for id:', bookingId);
        res.status(404).json({ message: 'Booking not found' });
        return;
      }

      // Find guest by user_id (which is guest _id)
      const guest = await GuestUser.findById(booking.user_id);
      console.log('[sendReceiptEmail] guest:', guest);
      if (!guest) {
        console.log('[sendReceiptEmail] Guest not found for user_id:', booking.user_id);
        res.status(404).json({ message: 'Guest not found' });
        return;
      }

      // Compose receipt email (detailed HTML style)
      const receiptNumber = String(booking._id).slice(-8).toUpperCase();
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();
      const guestName = guest.firstname && guest.lastname
        ? `${guest.firstname} ${guest.middlename ? guest.middlename + ' ' : ''}${guest.lastname}`
        : guest.username || ('Guest ' + String(booking.user_id).slice(-6));
      const formatPrice = (price: number) => `₱${(price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      const formatDateTime = (date: string | number | Date) => new Date(date).toLocaleString();
      const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Booking Receipt - ${receiptNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .receipt { max-width: 600px; margin: 0 auto; border: 2px solid #333; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .receipt-title { font-size: 18px; margin-bottom: 5px; }
          .receipt-number { font-size: 14px; color: #666; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .label { font-weight: bold; }
          .value { text-align: right; }
          .total { border-top: 2px solid #333; padding-top: 10px; margin-top: 20px; font-weight: bold; font-size: 18px; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          @media print { body { margin: 0; } .receipt { border: none; } }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="company-name">BORAK TRAVEL CEBU SERVICES</div>
            <div class="receipt-title">BOOKING RECEIPT</div>
            <div class="receipt-number">Receipt #: ${receiptNumber}</div>
            <div>Date: ${currentDate} | Time: ${currentTime}</div>
          </div>
          
          <div class="section">
            <div class="section-title">CUSTOMER INFORMATION</div>
            <div class="row">
              <span class="label">Customer Name:</span>
              <span class="value">${guestName}</span>
            </div>
            <div class="row">
              <span class="label">Email:</span>
              <span class="value">${guest.email || 'No email available'}</span>
            </div>
            <div class="row">
              <span class="label">Mobile Number:</span>
              <span class="value">${guest.mobile || 'No mobile number available'}</span>
            </div>
            <div class="row">
              <span class="label">Customer ID:</span>
              <span class="value">${booking.user_id}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">BOOKING DETAILS</div>
            <div class="row">
              <span class="label">Booking ID:</span>
              <span class="value">${booking._id}</span>
            </div>
            <div class="row">
              <span class="label">Destination:</span>
              <span class="value">${booking.destination}</span>
            </div>
            <div class="row">
              <span class="label">Pickup Location:</span>
              <span class="value">${booking.pickup_location}</span>
            </div>
            <div class="row">
              <span class="label">Pickup Date & Time:</span>
              <span class="value">${formatDateTime(booking.pickup_date)}</span>
            </div>
            <div class="row">
              <span class="label">Return Date & Time:</span>
              <span class="value">${formatDateTime(booking.return_date)}</span>
            </div>
            <div class="row">
              <span class="label">Number of Packs:</span>
              <span class="value">${booking.packs}</span>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">PAYMENT INFORMATION</div>
            <div class="row">
              <span class="label">Total Price:</span>
              <span class="value">${formatPrice(booking.price)}</span>
            </div>
            <div class="row">
              <span class="label">Paid Amount:</span>
              <span class="value">${booking.paid_amount ? formatPrice(booking.paid_amount) : '₱0.00'}</span>
            </div>
            <div class="row">
              <span class="label">Balance:</span>
              <span class="value">${formatPrice((booking.price ?? 0) - (booking.paid_amount || 0))}</span>
            </div>
            <div class="row">
              <span class="label">Payment Status:</span>
              <span class="value">${booking.payment_status}</span>
            </div>
            <div class="row">
              <span class="label">Booking Status:</span>
              <span class="value">${booking.status}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing Borak Travel Cebu Services!</p>
            <p>For inquiries, please contact us at work.boraktravel@gmail.com</p>
            <!-- Signature image omitted for email compatibility -->
          </div>
        </div>
      </body>
      </html>
      `;

      const emailResult = await EmailService.sendEmail({
        to: guest.email,
        subject: `Your Booking Receipt - Borak Travel Services`,
        html,
      });
      console.log('[sendReceiptEmail] emailResult:', emailResult);

      if (emailResult.success) {
        res.status(200).json({ message: 'Receipt sent successfully!' });
      } else {
        console.log('[sendReceiptEmail] Failed to send receipt email:', emailResult);
        res.status(500).json({ message: 'Failed to send receipt email.' });
      }
    } catch (error) {
      console.error('[sendReceiptEmail] Error sending receipt email:', error);
      res.status(500).json({ message: 'Failed to send receipt email.' });
    }
  },
};


import { Router, Request, Response } from 'express';
import { bookingController } from '../controllers/bookingController';

const router = Router();

// Define routes with proper typing
router.get('/getAll', bookingController.getAllBookings);
router.get('/bookingID/:id', bookingController.getBookingById);
router.get('/userBooking/:userId', bookingController.getUserBookings);
router.post('/create', bookingController.createBooking);
router.put('/update/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

export default router;
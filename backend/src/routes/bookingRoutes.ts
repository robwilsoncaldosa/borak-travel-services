import { Router } from 'express';
import { bookingController } from '../controllers/bookingController';

const router = Router();

router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getBookingById);
router.post('/', bookingController.createBooking);
router.put('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);
router.post('/:id/send-receipt', bookingController.sendReceiptEmail);


export default router;

import { Router } from 'express';
import { GuestController } from '../controllers/guestController';

const router = Router();

router.get('/', GuestController.getAllGuests);
router.get('/:id', GuestController.getGuestById);
router.post('/', GuestController.createGuestUser);
router.put('/:id', GuestController.updateGuestUser);

export default router;

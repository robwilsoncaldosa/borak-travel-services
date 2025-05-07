import { Router } from 'express';
import { GuestController } from '../controllers/guestController';

const router = Router();

router.post('/', (req, res) => GuestController.createGuestUser(req, res));

export default router;

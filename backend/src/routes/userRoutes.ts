import express, { Router, Request, Response, NextFunction } from 'express';
import { userController } from '../controllers/userController';

const router: Router = express.Router();

// Define route handler types
type RouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

// Apply type assertion to the controller methods
router.get('/getAll', userController.getAllUsers as RouteHandler);
router.get('/getID:id', userController.getUserById as RouteHandler);
router.post('/create', userController.createUser as RouteHandler);
// router.put('/update/:id', userController.updateUser as RouteHandler);
// router.delete('/remove/:id', userController.deleteUser as RouteHandler);

export default router;



import express, { Router, Request, Response, NextFunction } from 'express';
import { userController } from '../controllers/userController';

const router: Router = express.Router();

// Define route handler types
type RouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

// Apply type assertion to the controller methods
router.get('/', userController.getAllUsers as RouteHandler);
router.get('/:id', userController.getUserById as RouteHandler);
router.post('/', userController.createUser as RouteHandler);
router.put('/:id', userController.updateUser as RouteHandler);
router.delete('/:id', userController.deleteUser as RouteHandler);

export default router;



import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateToken } from '../lib/users';

export const userController = {
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  },

  getUserById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found'); // Debug log
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = generateToken(user._id.toString());

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  },

  createUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { password, ...userData } = req.body;
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({
        ...userData,
        password: hashedPassword
      });
      
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  },
};


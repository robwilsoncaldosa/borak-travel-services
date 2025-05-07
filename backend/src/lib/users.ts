
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from 'express';

interface JwtPayload {
  userId: string;
}

interface AuthRequest extends Request {
  userId?: string;
}

dotenv.config();

const generateToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }  // Token expires in 24 hours
  );
};

const isLoggedIn = (req: AuthRequest, res: Response, next: NextFunction): Response | void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(' ')[1];
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      req.userId = (decoded as JwtPayload).userId;
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export {
  isLoggedIn,
  generateToken,
};
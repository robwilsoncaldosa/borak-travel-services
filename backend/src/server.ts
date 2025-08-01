import express, { Request, Response } from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import passport from "passport";
import userRoutes from './routes/userRoutes';
import packageRoutes from './routes/packageRoutes';
import bookingRoutes from './routes/bookingRoutes';
import messageRoutes from './routes/messageRoutes';
import guestRoutes from './routes/guestRoutes';
import reviewRoutes from './routes/reviewRoutes';
import connectDB from './config/db';
import { initializeSocket } from './config/socket';
import { isLoggedIn } from './lib/users';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Configure CORS options
const corsOptions: cors.CorsOptions = {
  origin: [process.env.FRONTEND_URL || '', process.env.FRONTEND_URL_2 || '','http://localhost:3000'],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cats",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/reviews', reviewRoutes);

const PORT: number = parseInt(process.env.PORT || "8081", 10);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to BORAK CAR RENTAL TRAVEL AND TOURS");
});

connectDB();

// Make io available throughout the application
declare global {
  namespace Express {
    interface Request {
      io: typeof io;
    }
  }
}

// Attach the io instance to the request object
app.use((req, _, next) => {
  req.io = io; // Attach io to req
  next(); // Continue to next middleware/route
});

export default app;

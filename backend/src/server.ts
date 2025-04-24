import express, { Request, Response } from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import passport from "passport";
import userRoutes from './routes/userRoutes';
import packageRoutes from './routes/packageRoutes';
import connectDB from './config/db';

dotenv.config();

const app = express();

// socket.io
const server = http.createServer(app);

// Configure CORS options
const corsOptions: cors.CorsOptions = {
  origin: process.env.FRONTEND_URL,
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
app.use('/api/users', userRoutes);
app.use('/api/packages', packageRoutes);

const PORT: number = parseInt(process.env.PORT || "8081", 10);
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to BORAK CAR RENTAL TRAVEL AND TOURS");
});

// Add this after dotenv.config()
connectDB();

export default app;


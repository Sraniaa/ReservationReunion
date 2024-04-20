// Import necessary packages
import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Manage HTTP requests across different domains
import morgan from "morgan"; // Logging middleware
import cookieParser from "cookie-parser";

// Import custom database connection function
import { dbConnection } from "./database/dbConnection.js"; // Correct path as given

// Import routers
import testRouter from "./routes/testRouter.js";
import userRouter from "./routes/userRouter.js";
import adminRouter from "./routes/adminRouter.js";
import roomRouter from "./routes/roomRouter.js";
import reservationRouter from "./routes/reservationRouter.js"; // Assuming this is the correct path

// Import error handling middleware
import { errorMiddleware } from "./middlewares/error.js"; // Adjust path if necessary

// Initialize the Express application
const app = express();

// Load environment variables from .env file
dotenv.config({ path: "./config/.env" });

// Establish database connection
dbConnection();

// CORS settings
app.use(cors({
    origin: process.env.FRONTEND_URL, // Assuming this is defined in your .env for specific frontend interaction
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"], // Ensuring all needed HTTP methods are allowed
    credentials: true, // Allowing cookies and auth headers with requests
}));

// Middleware for parsing cookies and request bodies
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging HTTP requests
app.use(morgan('dev'));

// Route definitions using imported routers
app.use("/api/v1/tests", testRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/rooms", roomRouter);
app.use("/api/v1/reservations", reservationRouter); // Correctly mounted reservation routes

// Global error handling middleware
app.use(errorMiddleware);

// Export the configured app for use in server.js or testing
export default app;

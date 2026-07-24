import "dotenv/config";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.route.js";

// Create an Express application
const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    message: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

// Start the server
const port = process.env.PORT || 3000;

// Test route to check if the server is running
app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

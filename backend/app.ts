import express, { NextFunction, Request, Response } from "express";
import { imageRouter } from "./routes/imageRoutes.js";

// Create app
export const app = express();

// Enable CORS for frontend
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});

// Body parser - middleware that modifies incoming request data into json
app.use(express.json({ limit: "10kb" }));

// Serving static files
app.use(express.static("public"));

app.use("/images", imageRouter);

// ---- Error handling for routes

// 404 handler
app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    status: "fail",
    message: `Cannot find ${req.originalUrl} on this server!`,
  });
});

// Error handler
interface CustomError extends Error {
  status?: number;
}

app.use(
  (err: CustomError, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.status || 500).json({
      status: "error",
      message: err.message || "Internal Server Error",
    });
  }
);

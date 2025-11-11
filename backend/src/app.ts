import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  authRoutes,
  healthRoutes,
  helloRoutes,
  projectRoutes,
  timeEntryRoutes,
  timerRoutes,
} from "./api/routes";
import { errorHandler } from "./api/middlewares";

export const app: Application = express();

// CORS Configuration
const corsOptions = {
  origin: ["http://localhost:3001", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
  ],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", healthRoutes);
app.use("/api", helloRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/time-entries", timeEntryRoutes);
app.use("/api/timer", timerRoutes);

// Error handling
app.use(errorHandler);

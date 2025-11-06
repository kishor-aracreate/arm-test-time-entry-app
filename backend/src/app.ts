import express, { Application } from 'express';
import { healthRoutes, helloRoutes } from './api/routes';
import { errorHandler } from './api/middlewares';

export const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', healthRoutes);
app.use('/api', helloRoutes);

// Error handling
app.use(errorHandler);

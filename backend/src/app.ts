import express, { Application } from 'express';
import cors from 'cors';
import { healthRoutes, helloRoutes, authRoutes, projectRoutes, timeEntryRoutes, timerRoutes } from './api/routes';
import { errorHandler } from './api/middlewares';

export const app: Application = express();

// CORS Configuration
const corsOptions = {
    origin: [
        'http://localhost:5173', // Vite dev server
        'http://localhost:5174', // Alternative Vite port
        'http://localhost:3000', // Alternative frontend port
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api', healthRoutes);
app.use('/api', helloRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/time-entries', timeEntryRoutes);
app.use('/api/timer', timerRoutes);

// Error handling
app.use(errorHandler);

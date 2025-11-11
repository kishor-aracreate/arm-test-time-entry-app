import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router: Router = Router();
const authController = new AuthController();

/**
 * Auth Routes
 * ---------------------------------------------------------------------------
 * Public authentication endpoints (no auth middleware required)
 */

// Generate JWT token for a user ID
router.post('/token', (req, res) => authController.generateToken(req, res));

// Refresh access token using refresh token
router.post('/refresh', (req, res) => authController.refreshToken(req, res));

export { router as authRoutes };

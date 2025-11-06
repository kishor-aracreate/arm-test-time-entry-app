import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router: Router = Router();
const authController = new AuthController();

// Public routes (no authentication required)
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected routes (authentication required)
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/change-password', authMiddleware, authController.changePassword);

export { router as authRoutes };
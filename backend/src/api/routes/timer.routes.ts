import { Router } from 'express';
import { TimerController } from '../controllers/timer.controller';
import { userIdMiddleware } from '../middlewares';

const router: Router = Router();
const timerController = new TimerController();

// All timer routes require user ID
router.use(userIdMiddleware);

// Timer routes
router.post('/start', timerController.startTimer);
router.post('/stop', timerController.stopTimer);
router.get('/active', timerController.getActiveTimer);

export { router as timerRoutes };
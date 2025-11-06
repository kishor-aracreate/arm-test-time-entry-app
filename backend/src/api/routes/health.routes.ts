import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

const router: Router = Router();
const healthController = new HealthController();

router.get('/health', healthController.check);

export { router as healthRoutes };
import { Router } from 'express';
import { HelloController } from '../controllers/hello.controller';

const router: Router = Router();
const helloController = new HelloController();

router.get('/hello', helloController.getHello);

export { router as helloRoutes };
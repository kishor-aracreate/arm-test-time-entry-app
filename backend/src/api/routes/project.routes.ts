import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { userIdMiddleware } from '../middlewares';

const router: Router = Router();
const projectController = new ProjectController();

// All project routes require user ID
router.use(userIdMiddleware);

// Project CRUD routes
router.get('/', projectController.getProjects);
router.post('/', projectController.createProject);
router.get('/:id', projectController.getProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

export { router as projectRoutes };
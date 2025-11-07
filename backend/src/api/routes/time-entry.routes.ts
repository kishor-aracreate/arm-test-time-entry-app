import { Router } from 'express';
import { TimeEntryController } from '../controllers/time-entry.controller';
import { userIdMiddleware } from '../middlewares';

const router: Router = Router();
const timeEntryController = new TimeEntryController();

// All time entry routes require user ID
router.use(userIdMiddleware);

// Summary routes (must come before /:id routes to avoid conflicts)
router.get('/summary/daily', timeEntryController.getDailySummary);
router.get('/summary/weekly', timeEntryController.getWeeklySummary);

// Time entry CRUD routes
router.get('/', timeEntryController.getTimeEntries);
router.post('/', timeEntryController.createTimeEntry);
router.get('/:id', timeEntryController.getTimeEntry);
router.put('/:id', timeEntryController.updateTimeEntry);
router.delete('/:id', timeEntryController.deleteTimeEntry);

export { router as timeEntryRoutes };
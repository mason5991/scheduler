import { Router } from 'express';
import jobMiddleware from '../middlewares/jobMiddleware';
import jobController from '../controllers/job.controller';

const router = Router();

// Get queue or queue list
router.get('/:jobType', jobController.getJobs);

// Checking middleware
router.use('/:jobType', jobMiddleware);

// Add new jobs
router.post('/:jobType/add', jobController.addJobs);

export default router;

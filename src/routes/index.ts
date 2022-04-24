import { Router } from 'express';
import versionRoute from './version.route';
import jobRoute from './job.route';

const router = Router();

router.use('/version', versionRoute);
router.use('/job', jobRoute);

export default router;

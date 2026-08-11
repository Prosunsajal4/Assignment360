import { Router } from 'express';
import { reportController } from '../controllers/ReportController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/rentals', (req, res) => reportController.getRentalReport(req, res));

export default router;

import { Router } from 'express';
import { rentalController } from '../controllers/RentalController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', (req, res) => rentalController.getAll(req, res));
router.get('/:id', (req, res) => rentalController.getById(req, res));
router.post('/', (req, res) => rentalController.create(req, res));
router.put('/:id', (req, res) => rentalController.update(req, res));
router.delete('/:id', (req, res) => rentalController.delete(req, res));

export default router;

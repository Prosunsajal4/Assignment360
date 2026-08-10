import { Router } from 'express';
import { vehicleController } from '../controllers/VehicleController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.use(authenticateToken);

router.get('/', (req, res) => vehicleController.getAll(req, res));
router.get('/:id', (req, res) => vehicleController.getById(req, res));
router.post('/', upload.single('photo'), (req, res) => vehicleController.create(req, res));
router.put('/:id', upload.single('photo'), (req, res) => vehicleController.update(req, res));
router.delete('/:id', (req, res) => vehicleController.delete(req, res));

export default router;

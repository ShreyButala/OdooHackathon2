import { Router } from 'express';
import { maintenanceController } from '../controllers/maintenanceController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

// All routes are FLEET_MANAGER only
router.post('/', requireRole(UserRole.FLEET_MANAGER), maintenanceController.create);
router.patch('/:id/close', requireRole(UserRole.FLEET_MANAGER), maintenanceController.close);
router.get('/', requireRole(UserRole.FLEET_MANAGER), maintenanceController.findAll);
router.get('/:id', requireRole(UserRole.FLEET_MANAGER), maintenanceController.findById);

export default router;

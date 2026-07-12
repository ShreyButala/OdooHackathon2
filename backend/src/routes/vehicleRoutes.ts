import { Router } from 'express';
import { vehicleController } from '../controllers/vehicleController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

// GET routes (FLEET_MANAGER, DISPATCHER)
router.get('/', requireRole(UserRole.FLEET_MANAGER, UserRole.DISPATCHER), vehicleController.findAll);
router.get('/:id', requireRole(UserRole.FLEET_MANAGER, UserRole.DISPATCHER), vehicleController.findById);

// Write routes (FLEET_MANAGER only)
router.post('/', requireRole(UserRole.FLEET_MANAGER), vehicleController.create);
router.put('/:id', requireRole(UserRole.FLEET_MANAGER), vehicleController.update);
router.delete('/:id', requireRole(UserRole.FLEET_MANAGER), vehicleController.remove);

export default router;

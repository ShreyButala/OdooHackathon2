import { Router } from 'express';
import { fuelController } from '../controllers/fuelController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

// Routes for FLEET_MANAGER and DISPATCHER
router.post('/', requireRole(UserRole.FLEET_MANAGER, UserRole.DISPATCHER), fuelController.create);
router.get('/', requireRole(UserRole.FLEET_MANAGER, UserRole.DISPATCHER), fuelController.findAll);

export default router;

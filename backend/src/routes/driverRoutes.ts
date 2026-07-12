import { Router } from 'express';
import { driverController } from '../controllers/driverController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

// GET routes (SAFETY_OFFICER, DISPATCHER, FLEET_MANAGER)
router.get('/', requireRole(UserRole.SAFETY_OFFICER, UserRole.DISPATCHER, UserRole.FLEET_MANAGER), driverController.findAll);
router.get('/:id', requireRole(UserRole.SAFETY_OFFICER, UserRole.DISPATCHER, UserRole.FLEET_MANAGER), driverController.findById);

// Write routes (SAFETY_OFFICER only)
router.post('/', requireRole(UserRole.SAFETY_OFFICER), driverController.create);
router.put('/:id', requireRole(UserRole.SAFETY_OFFICER), driverController.update);
router.delete('/:id', requireRole(UserRole.SAFETY_OFFICER), driverController.remove);

export default router;

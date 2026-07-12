import { Router } from 'express';
import { tripController } from '../controllers/tripController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

// GET routes (DISPATCHER, FLEET_MANAGER)
router.get('/', requireRole(UserRole.DISPATCHER, UserRole.FLEET_MANAGER), tripController.findAll);
router.get('/:id', requireRole(UserRole.DISPATCHER, UserRole.FLEET_MANAGER), tripController.findById);

// Write routes (DISPATCHER only)
router.post('/', requireRole(UserRole.DISPATCHER), tripController.create);
router.patch('/:id/dispatch', requireRole(UserRole.DISPATCHER), tripController.dispatch);
router.patch('/:id/complete', requireRole(UserRole.DISPATCHER), tripController.complete);
router.patch('/:id/cancel', requireRole(UserRole.DISPATCHER), tripController.cancel);

export default router;

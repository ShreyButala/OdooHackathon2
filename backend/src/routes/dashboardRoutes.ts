import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

// Open read-only access to all authenticated staff roles
router.get(
  '/', 
  requireRole(UserRole.FLEET_MANAGER, UserRole.DISPATCHER, UserRole.SAFETY_OFFICER, UserRole.FINANCIAL_ANALYST), 
  dashboardController.getSummary
);

export default router;

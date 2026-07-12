import { Router } from 'express';
import { reportController } from '../controllers/reportController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

// GET /reports (role: FINANCIAL_ANALYST, read access for FLEET_MANAGER)
router.get('/', requireRole(UserRole.FINANCIAL_ANALYST, UserRole.FLEET_MANAGER), reportController.getReports);

export default router;

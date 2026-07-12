import { Router } from 'express';
import { expenseController } from '../controllers/expenseController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

// write: FINANCIAL_ANALYST
router.post('/', requireRole(UserRole.FINANCIAL_ANALYST), expenseController.create);

// read: FINANCIAL_ANALYST, FLEET_MANAGER
router.get('/', requireRole(UserRole.FINANCIAL_ANALYST, UserRole.FLEET_MANAGER), expenseController.findAll);

export default router;

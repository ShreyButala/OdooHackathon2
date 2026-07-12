import { Router } from 'express';

import authRoutes from './authRoutes';
import vehicleRoutes from './vehicleRoutes';
import driverRoutes from './driverRoutes';
import tripRoutes from './tripRoutes';
import maintenanceRoutes from './maintenanceRoutes';
import fuelRoutes from './fuelRoutes';
import expenseRoutes from './expenseRoutes';
import dashboardRoutes from './dashboardRoutes';
import reportRoutes from './reportRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/drivers', driverRoutes);
router.use('/trips', tripRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/fuel', fuelRoutes);
router.use('/expenses', expenseRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);

export default router;

import { UserRole } from '@prisma/client';

export const RBAC = {
  [UserRole.FLEET_MANAGER]: {
    fullAccess: ['Vehicles', 'Maintenance', 'Dashboard', 'Reports'],
    readOnly: []
  },
  [UserRole.DISPATCHER]: {
    fullAccess: ['Trips', 'Drivers'],
    readOnly: ['Vehicles']
  },
  [UserRole.SAFETY_OFFICER]: {
    fullAccess: ['Drivers', 'LicenseValidation'],
    readOnly: []
  },
  [UserRole.FINANCIAL_ANALYST]: {
    fullAccess: ['Expenses', 'Reports', 'Analytics'],
    readOnly: ['Vehicles', 'Trips', 'Maintenance', 'Drivers'] // Simplified "read-only elsewhere"
  }
};

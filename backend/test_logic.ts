import { isDriverAssignable } from './src/services/driverService';
import { DriverStatus } from '@prisma/client';

const runTests = () => {
  console.log("Testing SUSPENDED:", isDriverAssignable({ status: DriverStatus.SUSPENDED, licenseExpiry: new Date('2030-01-01') } as any));
  console.log("Testing ON_TRIP:", isDriverAssignable({ status: DriverStatus.ON_TRIP, licenseExpiry: new Date('2030-01-01') } as any));
  console.log("Testing OFF_DUTY:", isDriverAssignable({ status: DriverStatus.OFF_DUTY, licenseExpiry: new Date('2030-01-01') } as any));
  console.log("Testing Expired License:", isDriverAssignable({ status: DriverStatus.AVAILABLE, licenseExpiry: new Date('2020-01-01') } as any));
  console.log("Testing Valid Driver:", isDriverAssignable({ status: DriverStatus.AVAILABLE, licenseExpiry: new Date('2030-01-01') } as any));
}
runTests();

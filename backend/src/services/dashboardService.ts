import { prisma } from '../database';
import { VehicleStatus, DriverStatus, TripStatus } from '@prisma/client';

export const dashboardService = {
  async getSummary() {
    const [
      totalNonRetiredVehicles,
      availableVehicles,
      vehiclesInShop,
      vehiclesOnTrip,
      driversOnDuty,
      tripsActive,
      tripsPending
    ] = await Promise.all([
      prisma.vehicle.count({
        where: { status: { not: VehicleStatus.RETIRED } }
      }),
      prisma.vehicle.count({
        where: { status: VehicleStatus.AVAILABLE }
      }),
      prisma.vehicle.count({
        where: { status: VehicleStatus.IN_SHOP }
      }),
      prisma.vehicle.count({
        where: { status: VehicleStatus.ON_TRIP }
      }),
      prisma.driver.count({
        where: { status: DriverStatus.ON_TRIP }
      }),
      prisma.trip.count({
        where: { status: TripStatus.DISPATCHED }
      }),
      prisma.trip.count({
        where: { status: TripStatus.DRAFT }
      })
    ]);

    const fleetUtilizationRaw = totalNonRetiredVehicles > 0 
      ? (vehiclesOnTrip / totalNonRetiredVehicles) * 100 
      : 0;
      
    const fleetUtilization = Number(fleetUtilizationRaw.toFixed(2));

    return {
      activeVehicles: totalNonRetiredVehicles,
      availableVehicles,
      vehiclesInShop,
      driversOnDuty,
      tripsActive,
      tripsPending,
      fleetUtilization
    };
  }
};

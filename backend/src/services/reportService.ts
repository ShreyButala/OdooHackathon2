import { prisma } from '../database';
import { TripStatus } from '@prisma/client';
import { AppError } from '../utils/AppError';

export const reportService = {
  async getReports(query: { vehicleId?: string; revenue?: number }) {
    const vehicleWhere = query.vehicleId ? { id: query.vehicleId } : {};
    
    const vehicles = await prisma.vehicle.findMany({
      where: vehicleWhere,
      select: {
        id: true,
        registrationNumber: true,
        acquisitionCost: true,
      }
    });

    if (vehicles.length === 0 && query.vehicleId) {
      throw new AppError(404, 'Vehicle not found');
    }

    const vehicleBreakdowns = [];

    let fleetTotalDistance = 0;
    let fleetTotalFuelLiters = 0;
    let fleetTotalFuelCost = 0;
    let fleetTotalMaintenanceCost = 0;
    let fleetTotalExpenseCost = 0;

    for (const v of vehicles) {
      const tripAgg = await prisma.trip.aggregate({
        where: { vehicleId: v.id, status: TripStatus.COMPLETED },
        _sum: { actualDistance: true }
      });
      const actualDistance = Number(tripAgg._sum.actualDistance || 0);

      const fuelAgg = await prisma.fuelLog.aggregate({
        where: { vehicleId: v.id },
        _sum: { liters: true, cost: true }
      });
      const fuelLiters = Number(fuelAgg._sum.liters || 0);
      const fuelCost = Number(fuelAgg._sum.cost || 0);

      const maintAgg = await prisma.maintenance.aggregate({
        where: { vehicleId: v.id },
        _sum: { cost: true }
      });
      const maintenanceCost = Number(maintAgg._sum.cost || 0);

      const expenseAgg = await prisma.expense.aggregate({
        where: { vehicleId: v.id },
        _sum: { amount: true }
      });
      const expenseCost = Number(expenseAgg._sum.amount || 0);

      const operationalCost = fuelCost + maintenanceCost + expenseCost;
      
      const fuelEfficiency = fuelLiters > 0 
        ? Number((actualDistance / fuelLiters).toFixed(2)) 
        : 0;

      let roi: number | null = null;
      let roiNote = "revenue not modeled";
      
      const acquisitionCost = Number(v.acquisitionCost || 0);

      if (query.revenue !== undefined && acquisitionCost > 0) {
         roi = Number(((query.revenue - operationalCost) / acquisitionCost).toFixed(4));
         roiNote = "calculated based on provided revenue query parameter";
      }

      vehicleBreakdowns.push({
        vehicleId: v.id,
        registrationNumber: v.registrationNumber,
        actualDistance,
        fuelLiters,
        fuelCost,
        maintenanceCost,
        expenseCost,
        operationalCost,
        fuelEfficiency,
        roi,
        roiNote,
        dataSources: {
          fuelEfficiency: "Trip.actualDistance / FuelLog.liters",
          operationalCost: "FuelLog.cost + Maintenance.cost + Expense.amount"
        }
      });

      fleetTotalDistance += actualDistance;
      fleetTotalFuelLiters += fuelLiters;
      fleetTotalFuelCost += fuelCost;
      fleetTotalMaintenanceCost += maintenanceCost;
      fleetTotalExpenseCost += expenseCost;
    }

    const fleetOperationalCost = fleetTotalFuelCost + fleetTotalMaintenanceCost + fleetTotalExpenseCost;
    const fleetFuelEfficiency = fleetTotalFuelLiters > 0 
      ? Number((fleetTotalDistance / fleetTotalFuelLiters).toFixed(2))
      : 0;
      
    let fleetRoi: number | null = null;
    let fleetRoiNote = "revenue not modeled";
    
    const fleetAcquisitionCost = vehicles.reduce((sum, v) => sum + Number(v.acquisitionCost || 0), 0);

    if (query.revenue !== undefined && fleetAcquisitionCost > 0) {
      fleetRoi = Number(((query.revenue - fleetOperationalCost) / fleetAcquisitionCost).toFixed(4));
      fleetRoiNote = "calculated based on provided revenue query parameter";
    }

    const fleetSummary = {
      totalVehiclesAnalyzed: vehicles.length,
      actualDistance: fleetTotalDistance,
      fuelLiters: fleetTotalFuelLiters,
      fuelCost: fleetTotalFuelCost,
      maintenanceCost: fleetTotalMaintenanceCost,
      expenseCost: fleetTotalExpenseCost,
      operationalCost: fleetOperationalCost,
      fuelEfficiency: fleetFuelEfficiency,
      roi: fleetRoi,
      roiNote: fleetRoiNote,
      dataSources: {
        fuelEfficiency: "SUM(Trip.actualDistance) / SUM(FuelLog.liters)",
        operationalCost: "SUM(FuelLog.cost) + SUM(Maintenance.cost) + SUM(Expense.amount)"
      }
    };

    return {
      fleetSummary,
      vehicleBreakdowns
    };
  }
};

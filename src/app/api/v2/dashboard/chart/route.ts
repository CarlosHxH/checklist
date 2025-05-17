import { prisma } from '@/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const inspections = await prisma.inspection.groupBy({
      by: ['vehicleId'],
      _count: { vehicleId: true },
    });

    const vehicleIds = inspections.map((inspection) => inspection.vehicleId);
    const vehicles = await prisma.vehicle.findMany({
      where: {id: { in: vehicleIds }},
      select: { id: true, plate: true },
    });

    const total = inspections.reduce((acc, curr) => acc + curr._count.vehicleId, 0);

    const formattedData = inspections.map((item) => {
      const vehicle = vehicles.find((v) => v.id === item.vehicleId);
      return {
        id: item.vehicleId,
        label: vehicle?.plate || 'Não definido',
        value: item._count.vehicleId,
        count: item._count.vehicleId,
        percentage: (item._count.vehicleId / total) * 100,
      };
    });
    
    return NextResponse.json(formattedData,{status:201});
  } catch (error) {
    console.error("Error fetching inspections:", error);
    return NextResponse.json(
      { error: "Failed to fetch inspections" },
      { status: 500 }
    );
  }
}
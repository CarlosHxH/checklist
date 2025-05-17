import { prisma } from '@/prisma';
import { getFullYear } from '@/utils';
import { NextRequest, NextResponse } from 'next/server';

type InspectionByPlate = {
  id: string;
  label: string; // placa
  data: number[]; // contagem mensal
  stack: string;
}

type PrismaInspection = {
  id: string;
  plate: string;
  created_at: Date;
}
async function getInspectionsByPlate(): Promise<InspectionByPlate[]> {
  const { startDate, endDate} = getFullYear();

  // Buscar todas as inspeções do ano atual
  const inspections = await prisma.inspection.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      }
    },
    select: {
      id: true,
      vehicleId: true,
      createdAt: true,
      vehicle: true,
    },
    orderBy: {
      createdAt: 'asc',
    }
  });

  
  // Agrupar inspeções por placa
  const groupedByPlate = inspections.reduce((acc, inspection) => {
    if (!acc[inspection.vehicle.plate]) {
      acc[inspection.vehicle.plate] = {
        inspections: [],
        lastId: inspection.vehicleId
      };
    }
    acc[inspection.vehicle.plate].inspections.push({
      ...inspection,
      plate: inspection.vehicle.plate,
      created_at: inspection.createdAt,
    });
    return acc;
  }, {} as Record<string, { inspections: PrismaInspection[], lastId: string }>);

  // Transformar no formato desejado
  const result: InspectionByPlate[] = Object.entries(groupedByPlate).map(([plate, data]) => {
    // Inicializar array com 12 meses zerados
    const monthlyCount = Array(12).fill(0);

    // Contar inspeções por mês
    data.inspections.forEach(inspection => {
      const month = inspection.created_at.getMonth();
      monthlyCount[month]++;
    });

    return {
      id: data.lastId,
      label: plate,
      data: monthlyCount,
      stack: 'A'
    };
  });

  return result;
}

export async function GET(request: NextRequest) {
  try {
    const data = await getInspectionsByPlate();

    return NextResponse.json(data,{status:201});
  } catch (error) {
    console.error("Error fetching inspections:", error);
    return NextResponse.json(
      { error: "Failed to fetch inspections" },
      { status: 500 }
    );
  }
}
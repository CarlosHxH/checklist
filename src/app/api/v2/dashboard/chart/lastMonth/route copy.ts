import { prisma } from '@/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getLast30Days } from "@/utils";

type InspectionByPlate = {
    id: string;
    label: string; // placa
    data: number[]; // contagem por dia nos últimos 30 dias
    stack: string;
}

type InspectionWithPlate = {
    id: string;
    plateId: string;
    plate: string;
    createdAt: Date;
    day: number; // dia do mês (1-31)
    dayIndex: number; // índice (0-29) para os últimos 30 dias
}

export async function getInspectionsByPlate(): Promise<InspectionByPlate[]> {
    // Obter o intervalo dos últimos 30 dias
    const { startDate, endDate } = getLast30Days();
    
    // Buscar todas as inspeções dos últimos 30 dias
    const inspections = await prisma.inspection.findMany({
        where: {
            dataInspecao: {
                gte: startDate,
                lte: endDate
            },
            isFinished: true // Apenas inspeções finalizadas
        },
        select: {
            id: true,
            vehicleId: true,
            dataInspecao: true, // Usando o campo correto do schema
            vehicle: {
                select: {
                    plate: true
                }
            },
        },
        orderBy: {
            dataInspecao: 'asc',
        },
    });

    // Se não houver inspeções, retornar array vazio
    if (inspections.length === 0) {
        return [];
    }

    // Criar um mapa de dias para os últimos 30 dias (de 0 a 29)
    const daysMap = new Map<string, number>();
    for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        daysMap.set(dateStr, i);
    }

    // Processar as inspeções e adicionar informações necessárias
    const processedInspections: InspectionWithPlate[] = inspections
        .map(inspection => {
            const inspectionDate = inspection.dataInspecao as Date;
            const dateStr = inspectionDate.toISOString().split('T')[0];
            const dayIndex = daysMap.get(dateStr) || 0;

            return {
                id: inspection.id,
                plateId: inspection.vehicleId,
                plate: inspection.vehicle.plate,
                createdAt: inspectionDate,
                day: inspectionDate.getDate(), // Dia do mês (1-31)
                dayIndex: dayIndex // Índice para o array de 30 dias (0-29)
            };
        });

    // Agrupar inspeções por placa
    const groupedByPlate: Record<string, InspectionWithPlate[]> = {};
    
    processedInspections.forEach(inspection => {
        if (!groupedByPlate[inspection.plate]) {
            groupedByPlate[inspection.plate] = [];
        }
        groupedByPlate[inspection.plate].push(inspection);
    });

    // Transformar no formato desejado
    const result: InspectionByPlate[] = Object.entries(groupedByPlate).map(([plate, inspections]) => {
        // Inicializar array com 30 dias zerados
        const dailyCounts = Array(30).fill(0);

        // Contar inspeções por dia nos últimos 30 dias
        inspections.forEach(inspection => {
            dailyCounts[inspection.dayIndex]++;
        });

        return {
            id: plate, // ID é a própria placa
            label: plate, // Label é também a placa
            data: dailyCounts, // Contagem por dia
            stack: 'total', // Todas as placas na mesma stack
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
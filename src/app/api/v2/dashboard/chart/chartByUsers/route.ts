import prisma from '@/prisma';
import { getInspectionsLast30Days, getInspectionStatusLast30Days } from '@/services/inspectionService';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    // Obter dados para o gráfico de linha
    const start = await prisma.inspection.groupBy({
        by: ['userId'],
        where: {
            status: "INICIO"
        },
        _count: {
            userId: true
        }
    }).then(result => result.map(item => ({
        userId: item.userId,
        count: item._count.userId
    })));

    const end = await prisma.inspection.groupBy({
        by: ['userId'],
        where: {
            status: "FINAL"
        },
        _count: {
            userId: true
        }
    }).then(result => result.map(item => ({
        userId: item.userId,
        count: item._count.userId
    })));

    return NextResponse.json({start, end});
  } catch (error) {
    console.error('Erro ao buscar inspeções recentes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados de inspeções' },
      { status: 500 }
    );
  }
}
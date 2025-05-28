import { prisma } from '@/prisma';
import { endOfDay, subDays, startOfDay, format } from 'date-fns';

// Tipo para os dados formatados para o gráfico
export type InspectionChartData = {
  date: string;
  count: number;
};

/**
 * Retorna as inspeções criadas nos últimos 30 dias agrupadas por data
 */
export async function getInspectionsLast30Days(): Promise<InspectionChartData[]> {
  // Calcula a data de 30 dias atrás
  const thirtyDaysAgo = subDays(new Date(), 30);
  
  // Busca as inspeções no Prisma
  const inspections = await prisma.inspection.findMany({
    where: {
      createdAt: {
        gte: startOfDay(thirtyDaysAgo),
        lte: endOfDay(new Date()),
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Agrupa inspeções por data
  const inspectionsByDate = inspections.reduce<Record<string, number>>((acc, inspection) => {
    const dateKey = format(inspection.createdAt, 'yyyy-MM-dd');
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {});

  // Preenche datas faltantes nos últimos 30 dias para garantir consistência no gráfico
  const result: InspectionChartData[] = [];
  for (let i = 0; i < 30; i++) {
    const date = format(subDays(new Date(), 30 - i - 1), 'yyyy-MM-dd');
    result.push({
      date,
      count: inspectionsByDate[date] || 0,
    });
  }

  return result;
}

/**
 * Retorna contagem de inspeções finalizadas vs não-finalizadas nos últimos 30 dias
 */
export async function getInspectionStatusLast30Days() {
  const thirtyDaysAgo = subDays(new Date(), 30);

  const finishedCount = await prisma.inspection.count({
    where: {
      status: "INICIO",
      /*createdAt: {
        gte: startOfDay(thirtyDaysAgo),
      },*/
    },
  });

  const unfinishedCount = await prisma.inspection.count({
    where: {
      status: "FINAL",
      /*createdAt: {
        gte: startOfDay(thirtyDaysAgo),
      },*/
    },
  });

  const total = finishedCount;

  const finishedPercentage = total > 0 ? (finishedCount / total) * 100 : 0;
  const unfinishedPercentage = total > 0 ? (unfinishedCount / total) * 100 : 0;
  Math.round((unfinishedCount / total) * 100) || 0;
  return {
    finished: finishedCount,
    unfinished: unfinishedCount,
    total: total,
    finishedPercentage: finishedPercentage.toFixed(2), // Format to 2 decimal places
    unfinishedPercentage: unfinishedPercentage.toFixed(2), // Format to 2 decimal places
  };
}

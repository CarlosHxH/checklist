import { prisma } from '@/prisma';
import { endOfDay, subMonths, startOfDay, format, startOfMonth, endOfMonth, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipos para os dados do relatório
export type InspectionChartData = {
  date: string;
  count: number;
};

export type MonthlyInspectionData = {
  month: string;
  monthNumber: number;
  year: number;
  count: number;
  averagePerDay: number;
};

export type InspectionTrend = {
  period: string;
  count: number;
  growth: number; // Percentual de crescimento em relação ao período anterior
};

export type InspectionReport = {
  totalInspections: number;
  averagePerMonth: number;
  averagePerDay: number;
  monthlyData: MonthlyInspectionData[];
  chartData: InspectionChartData[];
  trends: {
    quarterly: InspectionTrend[];
    monthly: InspectionTrend[];
  };
  insights: {
    bestMonth: MonthlyInspectionData;
    worstMonth: MonthlyInspectionData;
    growthRate: number;
    totalGrowth: number;
  };
};

/**
 * Gera um relatório completo das inspeções dos últimos 12 meses
 */
export async function getInspectionsReport12Months(): Promise<InspectionReport> {
  // Calcula a data de 12 meses atrás
  const twelveMonthsAgo = subMonths(new Date(), 12);
  const startDate = startOfMonth(twelveMonthsAgo);
  const endDate = endOfDay(new Date());

  // Busca todas as inspeções dos últimos 12 meses
  const inspections = await prisma.inspection.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      }
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Gera dados mensais
  const monthlyData = generateMonthlyData(inspections, startDate);
  
  // Gera dados para gráfico (diários dos últimos 30 dias)
  const chartData = await generateDailyChartData();
  
  // Calcula tendências
  const trends = calculateTrends(monthlyData);
  
  // Calcula insights
  const insights = calculateInsights(monthlyData);
  
  // Calcula totais e médias
  const totalInspections = inspections.length;
  const averagePerMonth = totalInspections / 12;
  const averagePerDay = totalInspections / 365;

  return {
    totalInspections,
    averagePerMonth: Math.round(averagePerMonth * 100) / 100,
    averagePerDay: Math.round(averagePerDay * 100) / 100,
    monthlyData,
    chartData,
    trends,
    insights,
  };
}

/**
 * Gera dados mensais agrupados
 */
function generateMonthlyData(inspections: any[], startDate: Date): MonthlyInspectionData[] {
  const monthlyData: MonthlyInspectionData[] = [];
  
  // Cria array com todos os 12 meses
  for (let i = 0; i < 12; i++) {
    const monthDate = subMonths(new Date(), 11 - i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    
    // Conta inspeções do mês
    const monthInspections = inspections.filter(inspection => 
      inspection.createdAt >= monthStart && inspection.createdAt <= monthEnd
    );
    
    const daysInMonth = monthEnd.getDate();
    const count = monthInspections.length;
    
    monthlyData.push({
      month: format(monthDate, 'MMMM yyyy', { locale: ptBR }),
      monthNumber: monthDate.getMonth() + 1,
      year: monthDate.getFullYear(),
      count,
      averagePerDay: Math.round((count / daysInMonth) * 100) / 100,
    });
  }
  
  return monthlyData;
}

/**
 * Gera dados diários para o gráfico dos últimos 30 dias
 */
export async function generateDailyChartData(): Promise<InspectionChartData[]> {
  const thirtyDaysAgo = subDays(new Date(), 30);
  
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

  // Agrupa por data
  const inspectionsByDate = inspections.reduce<Record<string, number>>((acc, inspection) => {
    const dateKey = format(inspection.createdAt, 'yyyy-MM-dd');
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {});

  // Preenche todas as datas dos últimos 30 dias
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
 * Calcula tendências trimestrais e mensais
 */
export function calculateTrends(monthlyData: MonthlyInspectionData[]) {
  // Tendências trimestrais
  const quarterly: InspectionTrend[] = [];
  for (let i = 0; i < 4; i++) {
    const quarterStart = i * 3;
    const quarterMonths = monthlyData.slice(quarterStart, quarterStart + 3);
    const quarterCount = quarterMonths.reduce((sum, month) => sum + month.count, 0);
    
    let growth = 0;
    if (i > 0) {
      const prevQuarterStart = (i - 1) * 3;
      const prevQuarterMonths = monthlyData.slice(prevQuarterStart, prevQuarterStart + 3);
      const prevQuarterCount = prevQuarterMonths.reduce((sum, month) => sum + month.count, 0);
      growth = prevQuarterCount > 0 ? ((quarterCount - prevQuarterCount) / prevQuarterCount) * 100 : 0;
    }
    
    quarterly.push({
      period: `Q${i + 1} ${quarterMonths[0]?.year}`,
      count: quarterCount,
      growth: Math.round(growth * 100) / 100,
    });
  }

  // Tendências mensais (últimos 6 meses)
  const monthly: InspectionTrend[] = monthlyData.slice(-6).map((month, index) => {
    let growth = 0;
    if (index > 0) {
      const prevMonth = monthlyData.slice(-6)[index - 1];
      growth = prevMonth.count > 0 ? ((month.count - prevMonth.count) / prevMonth.count) * 100 : 0;
    }
    
    return {
      period: month.month,
      count: month.count,
      growth: Math.round(growth * 100) / 100,
    };
  });

  return { quarterly, monthly };
}

/**
 * Calcula insights do relatório
 */
function calculateInsights(monthlyData: MonthlyInspectionData[]) {
  const bestMonth = monthlyData.reduce((best, current) => 
    current.count > best.count ? current : best
  );
  
  const worstMonth = monthlyData.reduce((worst, current) => 
    current.count < worst.count ? current : worst
  );
  
  // Taxa de crescimento médio mensal
  const growthRates = monthlyData.slice(1).map((month, index) => {
    const prevMonth = monthlyData[index];
    return prevMonth.count > 0 ? ((month.count - prevMonth.count) / prevMonth.count) * 100 : 0;
  });
  
  const averageGrowthRate = growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
  
  // Crescimento total (primeiro vs último mês)
  const firstMonth = monthlyData[0];
  const lastMonth = monthlyData[monthlyData.length - 1];
  const totalGrowth = firstMonth.count > 0 ? 
    ((lastMonth.count - firstMonth.count) / firstMonth.count) * 100 : 0;

  return {
    bestMonth,
    worstMonth,
    growthRate: Math.round(averageGrowthRate * 100) / 100,
    totalGrowth: Math.round(totalGrowth * 100) / 100,
  };
}

/**
 * Gera relatório em formato de texto para exportação
 */
export function generateTextReport(report: InspectionReport): string {
  const { totalInspections, averagePerMonth, averagePerDay, monthlyData, insights, trends } = report;
  
  return `
RELATÓRIO DE INSPEÇÕES - ÚLTIMOS 12 MESES
========================================

RESUMO EXECUTIVO
----------------
• Total de Inspeções: ${totalInspections}
• Média Mensal: ${averagePerMonth} inspeções
• Média Diária: ${averagePerDay} inspeções

PERFORMANCE MENSAL
------------------
${monthlyData.map(month => 
  `${month.month}: ${month.count} inspeções (${month.averagePerDay}/dia)`
).join('\n')}

INSIGHTS PRINCIPAIS
-------------------
• Melhor mês: ${insights.bestMonth.month} (${insights.bestMonth.count} inspeções)
• Pior mês: ${insights.worstMonth.month} (${insights.worstMonth.count} inspeções)
• Taxa de crescimento médio: ${insights.growthRate}% ao mês
• Crescimento total no período: ${insights.totalGrowth}%

TENDÊNCIAS TRIMESTRAIS
----------------------
${trends.quarterly.map(quarter => 
  `${quarter.period}: ${quarter.count} inspeções (${quarter.growth > 0 ? '+' : ''}${quarter.growth}%)`
).join('\n')}

TENDÊNCIAS MENSAIS (Últimos 6 meses)
------------------------------------
${trends.monthly.map(month => 
  `${month.period}: ${month.count} inspeções (${month.growth > 0 ? '+' : ''}${month.growth}%)`
).join('\n')}

Relatório gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
  `.trim();
}

/**
 * Função legada mantida para compatibilidade
 */
export async function getInspectionsLast30Days(): Promise<InspectionChartData[]> {
  const report = await getInspectionsReport12Months();
  return report.chartData;
}


/**
 * Retorna contagem de inspeções finalizadas vs não-finalizadas nos últimos 30 dias
 */
export async function getInspectionStatusLast360Days() {
  const thirtyDaysAgo = subDays(new Date(), 360);

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

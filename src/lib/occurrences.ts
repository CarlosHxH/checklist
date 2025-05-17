type DailyOccurrence = { day: number; count: number };

const config = (year: number, month: number,where?:any) => {
  // Primeiro dia do mês
  const startDate = new Date(year, month - 1, 1);
  // Payload ara selecionar um Mês especifico, pode-se adionar mais filtros.
  return {
    where: {
      ...where,// query adicional
      // Seleciona o intervalo
      createdAt: {
        gte: startDate,
        lt: new Date(year, month, 1),
      }
    },
    // Dados que vai retornar
    select: { createdAt: true },
  };
};

// Função genérica para obter ocorrências mensais
export async function getOccurrences(
  table: any, // O modelo da tabela (ex: prisma.inspection)
  year: number, // Ano de filtragem
  month: number, // Mês de filtragem
  where?:any, // Query adicional
): Promise<DailyOccurrence[]> {
  const endDate = new Date(year, month, 0);
  const daysInMonth = endDate.getDate();
  // Buscar todas as ocorrências do mês na tabela especificada
  const occurrences = await table.findMany(config(year, month,where));
  // Inicializar array com zeros para todos os dias do mês
  const dailyCounts: number[] = Array(daysInMonth).fill(0);
  // Contar ocorrências por dia
  occurrences.forEach((occurrence: { createdAt: Date }) => {
    const day = occurrence.createdAt.getDate();
    dailyCounts[day - 1]++; // Subtrai 1 porque array começa em 0
  });
  // Formatar resultado
  const result: DailyOccurrence[] = dailyCounts.map((count, index) => ({ day: index + 1, count: count }));
  return result;
}
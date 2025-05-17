import { getInspectionsLast30Days, getInspectionStatusLast30Days } from '@/services/inspectionService';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    // Obter dados para o gráfico de linha
    const inspectionsData = await getInspectionsLast30Days();
    
    // Obter estatísticas sobre inspeções finalizadas e não-finalizadas
    const statusData = await getInspectionStatusLast30Days();

    return NextResponse.json({
      inspectionsByDate: inspectionsData,
      statusSummary: statusData,
    });
  } catch (error) {
    console.error('Erro ao buscar inspeções recentes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados de inspeções' },
      { status: 500 }
    );
  }
}
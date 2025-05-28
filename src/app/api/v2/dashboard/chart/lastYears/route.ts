import { getInspectionsReport12Months } from '@/services/inspectionServiceYears';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    // Obter dados para o gráfico de linha
    const inspectionsData = await getInspectionsReport12Months();
    return NextResponse.json(inspectionsData);
  } catch (error) {
    console.error('Erro ao buscar inspeções recentes:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados de inspeções' },
      { status: 500 }
    );
  }
}
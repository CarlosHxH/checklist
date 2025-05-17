import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/prisma';

interface UpdateStatusRequest {
  section: 'start' | 'end';
  data: {
    nivelAgua?: string;
    nivelOleo?: string;
    avariasCabine?: string;
    bauPossuiAvarias?: string;
    funcionamentoParteEletrica?: string;
    descricaoAvariasCabine?: string | null;
    descricaoAvariasBau?: string | null;
    descricaoParteEletrica?: string | null;
    resolvidoPor: string;
    observacoes?: string | null;

    dianteira?: string | null;
    descricaoDianteira?: string | null;
    tracao?: string | null;
    descricaoTracao: string | null;
    truck?: string | null;
    descricaoTruck?: string | null;
    quartoEixo?: string | null;
    descricaoQuartoEixo?: string | null;
  };
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id: inspectionId } = await params;
    const body: UpdateStatusRequest = await request.json();

    if (!body || !body.section || !body.data) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    // Primeiro, obtenha a inspeção para verificar que ele existe e para obter os IDs relacionados
    const inspection = await prisma.inspect.findUnique({ where: { id: inspectionId } });

    if (!inspection) {
      return NextResponse.json({ error: 'Inspeção não encontrada' }, { status: 404 });
    }

    // Determine qual registro a atualizar com base na seção
    const recordId = body.section === 'start' ? inspection.startId : inspection.endId;

    if (!recordId) {
      return NextResponse.json(
        { error: `Registro de ${body.section === 'start' ? 'início' : 'fim'} não encontrado` },
        { status: 404 }
      );
    }

    // Create update data
    const updateData: { [key: string]: any } = { updatedAt: new Date() };

    // Only include fields that were sent in the request
    if (body?.data?.nivelAgua !== undefined) updateData.nivelAgua = body?.data?.nivelAgua;
    if (body?.data?.nivelOleo !== undefined) updateData.nivelOleo = body?.data?.nivelOleo;
    if (body?.data?.avariasCabine !== undefined) updateData.avariasCabine = body?.data?.avariasCabine;
    if (body?.data?.bauPossuiAvarias !== undefined) updateData.bauPossuiAvarias = body?.data?.bauPossuiAvarias;
    if (body?.data?.funcionamentoParteEletrica !== undefined) updateData.funcionamentoParteEletrica = body?.data?.funcionamentoParteEletrica;

    updateData.descricaoAvariasCabine = body?.data?.descricaoAvariasCabine || null;
    updateData.descricaoAvariasBau = body?.data?.descricaoAvariasBau || null;
    updateData.descricaoParteEletrica = body?.data?.descricaoParteEletrica || null;

    if (body?.data?.dianteira !== undefined) {
      updateData.dianteira = body?.data?.dianteira;
      updateData.descricaoDianteira = body?.data?.descricaoDianteira || null;
    }
    if (body?.data?.tracao !== undefined) {
      updateData.tracao = body?.data?.tracao;
      updateData.descricaoTracao = body?.data?.descricaoTracao || null;
    }
    if (body?.data?.truck !== undefined) {
      updateData.truck = body?.data?.truck;
      updateData.descricaoTruck = body?.data?.descricaoTruck || null;
    }
    if (body?.data?.quartoEixo !== undefined) {
      updateData.quartoEixo = body?.data?.quartoEixo;
      updateData.descricaoQuartoEixo = body?.data?.descricaoQuartoEixo || null;
    }

    if (body?.data) {
      await prisma.correction.create({
        data: {
          inspectionId: recordId,
          section: body.section,
          resolvidoPor: body.data.resolvidoPor,
          observacoes:  JSON.stringify(body.data) || '',
          userId: session.user.id,
        }
      });
    }

    // Update the inspection record
    const updateResult = await prisma.inspection.update({
      where: { id: recordId },
      data: updateData,
    });

    return NextResponse.json({ message: 'Status atualizado com sucesso', data: updateResult }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Erro ao atualizar o status da inspeção', code: error.code || 'unknown' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { z } from "zod";
import { InspectionFormData } from "@/types/InspectionSchema";

async function transaction(validatedData: InspectionFormData) {
  const { photos, ...data } = validatedData;

  // Executar a transação
  const result = await prisma.$transaction(async (tx) => {
    // 1. Criar a inspeção
    const inspection = await tx.inspection.create({ data });

    // 2. Se houver fotos, criar os registros de fotos
    if (photos && photos.length > 0) {
      await tx.inspectionPhoto.createMany({
        data: photos.map((photo) => ({
          inspectionId: inspection.id,
          ...photo
        })),
      });
    }

    // 3. Retornar a inspeção criada com suas fotos
    return tx.inspection.findUnique({
      where: { id: inspection.id },
      include: { photos: true },
    });
  });

  return result;
}
export async function GET(request: NextRequest) {
  try {
    const inspections = await prisma.inspection.findMany({
      where: { status: 'INSPECAO' },
      include: {
        vehicle: true,
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: { dataInspecao: "desc" }
    });
    return NextResponse.json(inspections, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // Validar os dados recebidos
    const response = await transaction(data);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
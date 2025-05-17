import { prisma } from "@/prisma"
import { NextRequest, NextResponse } from "next/server";

async function createInspectionWithTransaction({ data, id }: { data: any, id?: string }) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Crie o registro de inspeção
      const inspection = await tx.inspection.create({ data });
      // Crie o grupo de registro de inspeção
      const inspect = await tx.inspect.upsert({
        where: { id: id ?? 'dummy-id' },
        create: {
          userId: data.userId,
          ...(data.status === "INICIO" ? { startId: inspection.id } : { endId: inspection.id }),
        },
        update: {
          userId: data.userId,
          ...(data.status === "INICIO" ? { startId: inspection.id } : { endId: inspection.id }),
        },
      })
      return { inspection, inspect }
    })
    return result
  } catch (error) {
    console.error('Transaction failed:', error)
    throw error
  }
}


export async function GET(request: NextRequest) {

  try {
    const inspections = await prisma.inspect.findMany({
      include: {
        user: { select: { name: true } },
        start: true,
        end: true,
        vehicle: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(inspections)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { id, ...data } = await request.json();
    const res = await createInspectionWithTransaction({ data, id })
    return NextResponse.json(res, { status: 400 });
  } catch (error) {
    console.error('Prisma error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
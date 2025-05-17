import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  try {
    const id = (await params).id;
    if(!id) return NextResponse.json({error: 'Erro interno do servidor'}, { status: 401 });
    const inspections = await prisma.inspection.findMany({
      where: { userId: id, status: "INSPECAO" },
      include: { vehicle: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(inspections, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
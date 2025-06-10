import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

const format = async (
  title: string,
  label: "up" | "down" | "neutral",
  interval: number | string,
  occurrences: string | number
) => {
  return {
    title,
    value: `${occurrences}`,
    interval: interval,
    trend: { label, value: "" },
    data: [],
  };
};

async function processInspectionData() {
  const users = await prisma.user.findMany({select: {id: true, name: true}});
  const iniciada = await prisma.inspection.groupBy({by: ['userId'], where: { status: 'INICIO' }, _count: { id: true }});
  const finalizada = await prisma.inspection.groupBy({by: ['userId'], where: { status: 'FINAL' }, _count: { id: true }});

  const result = iniciada.map((inicio) => {
    const userId = inicio.userId;
    const final = finalizada.find((f) => f.userId === userId);
    const finalCount = final ? final._count.id : 0;
    const user = users.find(e=>e.id===userId);
    return {
      iniciada: inicio._count.id,
      finalizada: finalCount,
      motorista: user?.name,
    };
  });
  return result;
}

export async function GET(request: NextRequest) {
  try {
    const inspections = await prisma.inspection.count({ where: { status: "INSPECAO" } });
    const viagens = await prisma.inspection.count({ where: { NOT: { status: "INSPECAO" } } });
    const users = await prisma.user.count();
    const vehicles = await prisma.vehicle.count();
    // Buscando todos os usuários
    const inspection = await format("Inspeções", "up", "Total", inspections);
    const viagen = await format("Viagens", "up", "Total", viagens);
    const user = await format("Usuários", "down", "Total", users);
    const vehicle = await format("Veiculos", "neutral", "Total", vehicles);
    
    const byUsers = await processInspectionData();

    return NextResponse.json({cards:[user, viagen, inspection, vehicle],byUsers});
  } catch (error) {
    return NextResponse.json({ error }, { status: 403 });
  } finally {
    await prisma.$disconnect();
  }
}

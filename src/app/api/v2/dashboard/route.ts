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

export async function GET(request: NextRequest) {
  try {
    const inspections = await prisma.inspection.count({where: { status: "INSPECAO" }});
    const viagens = await prisma.inspection.count({where: { NOT: { status: "INSPECAO" } }});
    const users = await prisma.user.count();
    const vehicles = await prisma.vehicle.count();

    // Buscando todos os usuários
    const inspection = await format("Inspeções", "up", "Total", inspections);
    const viagen = await format("Viagens", "up", "Total", viagens);
    const user = await format("Usuários", "down", "Total", users);
    const vehicle = await format("Veiculos", "neutral", "Total", vehicles);

    return NextResponse.json([user, viagen, inspection, vehicle]);
  } catch (error) {
    return NextResponse.json({ error }, { status: 403 });
  } finally {
    await prisma.$disconnect();
  }
}

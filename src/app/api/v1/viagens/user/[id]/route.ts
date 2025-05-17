import { prisma } from "@/prisma"
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  try {
    const userId = (await params).id;
    const inspections = await prisma.inspect.findMany({
      where: { userId },
      include: {
        user: { select: { name: true }},
        start: true,
        end: true,
        vehicle: true
      },
      orderBy: {createdAt: 'desc'},
      take: 4,
    });
    return NextResponse.json(inspections)
  } catch (error) {
    return NextResponse.json(error)
  }
}
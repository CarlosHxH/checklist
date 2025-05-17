import { prisma } from '@/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const occurrences = await prisma.inspect.findMany({
        include:{
            user: true,
            vehicle: true,
            start: true,
            end: true,
        },
        orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(occurrences);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar ocorrências' },
      { status: 500 }
    );
  }
}
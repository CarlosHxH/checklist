import { prisma } from "@/prisma"
import { NextRequest, NextResponse } from "next/server";

async function getTransaction(id:string) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const inspections = await tx.inspect.findFirst({
        where: { id },
        include: {
          user: {
            select: {
              name: true,
            },
          },
          start: {
            include: {
              photos: true,
            },
          },
          end: {
            include: {
              photos: true,
            },
          },
          vehicle: true
        },
        orderBy: { createdAt: 'desc' },
      });
      return { inspections };
    });
    
    return result;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  
  try {
    const id = (await params).id;
    const data = await getTransaction(id);
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(error)
  }
}

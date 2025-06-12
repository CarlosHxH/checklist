import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    if (!id) {
      return NextResponse.json(
        { error: "Missing required ID" },
        { status: 400 }
      );
    }
    const [users, vehicles, vehicleKeys] = await prisma.$transaction([
      prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          username: true,
          isActive: true,
          vehiclekey: true,
        },
      }),
      prisma.vehicle.findMany(),

      prisma.vehicleKey.findMany({
        where: {
          status: "PENDING",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              isActive: true,
            },
          },
          vehicle: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return NextResponse.json({
      users,
      vehicles,
      vehicleKeys,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}

// DELETE pending transfer
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const deletedTransfer = await prisma.vehicleKey.delete({ where: { id, status: "PENDING" }});
    if (!deletedTransfer) throw new Error('Transferência pendente não encontrada!');
    return NextResponse.json(deletedTransfer, { status: 200 });
  } catch (error) {
    console.error('Erro ao rejeitar a transferência:', error);
    return NextResponse.json(
      { error: 'Erro ao rejeitar a transferência' }, 
      { status: 500 }
    );
  }
}
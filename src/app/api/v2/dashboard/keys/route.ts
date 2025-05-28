import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

// GET all keys
export async function GET(request: NextRequest) {
  try {
    const [users, vehicles, vehicleKeys] = await prisma.$transaction([
      prisma.user.findMany({
        orderBy: {
          name: "asc",
        },
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

// POST new key transfer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, vehicleId, parentId, id } = body;

    // Validate input
    if (!userId || !vehicleId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Start transaction
    const newTransfer = await prisma.$transaction(async (tx) => {
      // Check if user exists
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error("User not found");
      }

      // Check if vehicle exists
      const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId } });
      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      // Create new transfer
      const transfer = await tx.vehicleKey.create({
        data: {
          userId,
          vehicleId,
          parentId,
          status: id ? "CONFIRMED" : "PENDING",
        },
        include: {
          user: true,
          vehicle: true,
        },
      });
      return transfer;
    });

    return NextResponse.json(newTransfer);
  } catch (error) {
    console.error("Error creating transfer:", error);
    return NextResponse.json(
      { error: "Error creating transfer" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  try {
    const id = (await params).id;
    const dell = await prisma.vehicleKey.delete({ where: { id, status: "PENDING" } })
    if (!dell) throw new Error('Transferência pendente não encontrada!');
    return NextResponse.json(dell, { status: 201 })
  } catch (error) {
    console.error('Erro, rejeitando a transferência:', error)
    return NextResponse.json({ error: 'Erro, rejeitando a transferência' }, { status: 500 })
  }
}
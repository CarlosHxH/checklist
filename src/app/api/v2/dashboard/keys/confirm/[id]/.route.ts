import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

async function transfer(id: string) {
  return prisma.$transaction(async (tx) => {
    // 1. Decrement amount from the sender.
    const currentTransfer = await tx.vehicleKey.findUnique({
      where: { id },
      include: { vehicle: true },
    });

    if (!currentTransfer) throw new Error("Transferência não encontrada");
    if (currentTransfer.status !== "PENDING")
      throw new Error("Transferência não está pendente");

    const user = await prisma.user.findFirst({
      where: { id: currentTransfer.userId },
    });

    if (user?.role === "DRIVER") {
      const inspection = await prisma.inspection.create({
        data: {
          userId: currentTransfer.userId,
          vehicleId: currentTransfer.vehicleId,
          status: "INICIO",
        },
      });
      if (!inspection) throw new Error("Erro na transferencia");
      const group = await prisma.inspect.create({
        data: {
          userId: currentTransfer.userId,
          vehicleId: currentTransfer.vehicleId,
          startId: inspection.id,
        },
      });
    }

    // Update current transfer
    const updated = await tx.vehicleKey.update({
      where: { id },
      data: {
        status: "CONFIRMED",
        updatedAt: new Date(),
      },
      include: {
        user: true,
        vehicle: true,
      },
    });
    return updated;
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const updatedTransfer = transfer(id);
    return NextResponse.json(updatedTransfer);
  } catch (error) {
    console.error("Error confirming transfer:", error);
    return NextResponse.json(
      { error: "Error confirming transfer" },
      { status: 500 }
    );
  }
}

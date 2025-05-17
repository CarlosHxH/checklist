import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function PUT( request: NextRequest, { params }: { params: Promise<{ id: string }>}) {

  try {
    const id = (await params).id;
    // Update current transfer
    const updated = await prisma.vehicleKey.update({
      where: { id, NOT:{ status: "CONFIRMED"} },
      data: {
        status: "CONFIRMED",
        updatedAt: new Date(),
      }
    });

    if(updated){
      await prisma.inspect.create({
        data: {
          userId: updated.userId,
          vehicleId: updated.vehicleId,
        },
      });
    }

    return NextResponse.json(updated,{ status: 201 });
  } catch (error) {
    console.error("Error confirming transfer:", error);
    return NextResponse.json({ error: "Error confirming transfer" },{ status: 500 });
  }
}

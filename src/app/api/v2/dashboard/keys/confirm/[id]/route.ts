import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";

async function transfer(dataSource:{id:string,userId:string}) {
  const { id, userId } = dataSource;
  return prisma.$transaction(async (tx) => {
    try {
      const currentTransfer = await tx.vehicleKey.findUnique({where: { id }});
      if (!currentTransfer) throw new Error("Transferência não encontrada");
      if (currentTransfer.status !== "PENDING") throw new Error("Transferência não está pendente");

      const updated = await tx.vehicleKey.update({
        where: { id },
        data: {
          status: "CONFIRMED",
          updatedAt: new Date(),
        }
      });
      const create = await tx.vehicleKey.create({
        data:{
          userId: userId,
          status: "CONFIRMED",
          parentId: updated.id || null,
          vehicleId: updated.vehicleId,
        }
      })
      return create;
    } catch (error) {
      console.log({error});
    }
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const data = await request.json();
    console.log(id,{data});
    
    //const confirmed = await transfer(id, userId)
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error confirming transfer:", error);
    return NextResponse.json(
      { error: "Error confirming transfer" },
      { status: 500 }
    );
  }
}

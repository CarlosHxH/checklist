import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  try {
    await prisma.vehicle.delete({where: { id }});
    return NextResponse.json({ success: true },{ status: 200 });
  } catch (error) {
    return NextResponse.json("Erro, Usuário vinculado a um registro!", { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
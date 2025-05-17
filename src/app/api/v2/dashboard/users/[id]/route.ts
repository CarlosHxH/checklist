import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    const id = (await params).id;
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json("Erro, Usuário vinculado a um registro!", {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
}

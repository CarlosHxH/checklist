import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const { id } = await request.json();

    const data = await prisma.vehicleKey.update({
      where: { id },
      data: { status: 'PENDING' }
    })
    return NextResponse.json(data,{status:201})
  } catch (error) {
    console.error('Error confirming transfer:', error)
    return NextResponse.json(
      { error: 'Error confirming transfer' },
      { status: 500 }
    )
  }
}
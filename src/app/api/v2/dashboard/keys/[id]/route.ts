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

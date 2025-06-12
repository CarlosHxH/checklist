import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { VehicleKey } from "@prisma/client";

interface GroupedVehicle {
  id: string,
  vehicleKeys: any;
}

const groupVehicleKeys = (vehicleKeys: VehicleKey[]): Record<string, GroupedVehicle> | undefined => {
  if (!vehicleKeys || vehicleKeys.length === 0) return undefined;
  const grouped = vehicleKeys.reduce<Record<string, GroupedVehicle>>((acc, key) => {
    if (!acc[key.vehicleId]) {
      acc[key.vehicleId] = {
        id: key.vehicleId,
        vehicleKeys: vehicleKeys.filter(k => k.vehicleId === key.vehicleId)
      };
    }
    return acc;
  }, {});
  return grouped;
};

async function getLastVehicleIds() {
  const vehicleKeys = await prisma.vehicleKey.findMany({
    orderBy: { createdAt: 'desc' },
    select:{
      id: true,
      status: true,
      vehicleId: true,
      user: { select:{ name: true }},
      vehicle: {
        select: {
          plate: true,
          model: true,
        }
      },
    },
    distinct: ['vehicleId'],
  });
  const keys = vehicleKeys.map(v=>({
    id: v.id,
    'user': v.user.name,
    'vehicle': v.vehicle.plate +' - '+v.vehicle.model,
    'status': v.status,
    'vehicleId': v.vehicleId,
  }))
  return keys;
}

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
          name: true
        },
      }),
      prisma.vehicle.findMany({
        orderBy: {
          plate: "asc",
        },
        select:{
          id: true,
          plate: true,
          model: true
        }
      }),
      prisma.vehicleKey.findMany({
        select: {
          id: true,
          status: true,
          user: {
            select: {
              name: true,
            },
          },
          vehicle: {
            select: {
              plate: true,
              model: true,
            },
          },
          createdAt: true,
          updatedAt: true,
          vehicleId: true,
          userId: true,
          parentId: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    const grouped = groupVehicleKeys(vehicleKeys);
    const last = await getLastVehicleIds()

    return NextResponse.json({
      users,
      vehicles,
      grouped,
      last
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Error fetching data" },{ status: 500 });
  }
}

// POST new key transfer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, vehicleId, parentId, newUser } = body;
    // Validate input
    if (!userId || !vehicleId) {
      return NextResponse.json({ error: "Missing required fields" },{ status: 400 });
    }
    // Start transaction
    const newTransfer = await prisma.$transaction(async (tx) => {
      // Check if user exists
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("User not found")
      // Check if vehicle exists
      const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId } });
      if (!vehicle) throw new Error("Vehicle not found");
      // Create new transfer
      if(!!parentId) {
        await tx.vehicleKey.update({where: { id: parentId },data:{ status: "CONFIRMED" }})
      }
      const transfer = await tx.vehicleKey.create({
        data: {
          userId,
          vehicleId,
          parentId,
          status: !!newUser?"CONFIRMED":"PENDING",
        }
      });
      return transfer;
    });

    return NextResponse.json(newTransfer, { status: 201 });
  } catch (error) {
    console.error("Error creating transfer:", error);
    return NextResponse.json(
      { error: "Error creating transfer" },
      { status: 500 }
    );
  }
}


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
      throw error
    }
  });
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const confirmed = await transfer(data)
    return NextResponse.json(confirmed);
  } catch (error) {
    console.error("Error confirming transfer:", error);
    return NextResponse.json({ error: "Error confirming transfer" },{ status: 500 });
  }
}
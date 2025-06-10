import { prisma } from "@/prisma"
import { fileToBase64 } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import { createInspectionWithTransaction } from "../inspection.service";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  try {
    const id = (await params).id;
    const inspections = await prisma.inspect.findUnique({
      where: { id },
      include: {
        vehicle: {
          select: {
            id: true,
            model: true,
            plate: true,
            eixo: true,
          },
        },
        start: true,
        end: true,
      }
    });
    return NextResponse.json(inspections)
  } catch (error) {
    return NextResponse.json(error)
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const formData = await request.formData();

    const data: any = {};
    // Process all form fields
    for (const [key, value] of formData.entries()) {
      if (key === 'photos') {
        // Handle multiple photos
        if (!data.photos) data.photos = [];

        // Check if value is a File or Blob
        if (value instanceof Blob) {
          const base64 = await fileToBase64(value);
          data.photos.push({
            photo: base64,
            type: 'vehicle',
            description: `Veiculo foto-${data.photos.length + 1}`
          });
        }
      } else {
        // Handle regular form fields
        data[key] = value;
      }
    }

    // Convert isFinished to boolean
    data.isFinished = true;

    const result = await createInspectionWithTransaction({id,...data});
    //const result = await createInspectionWithTransaction(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating inspection:', error);
    return NextResponse.json(
      {
        error: 'Failed to create inspection',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/*
async function createInspectionWithTransaction({ data, id }: { data: any, id: string }) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Crie o registro de inspeção
      const inspection = await tx.inspection.create({ data });
      // Crie o grupo de registro de inspeção
      const inspect = await tx.inspect.upsert({
        where: {
          id: id ?? 'dummy-id',
          ...(inspection.vehicleId ? {} : {}),
        },
        create: {
          userId: data.userId,
          ...(data.status === "INICIO"
            ? { startId: inspection.id }
            : { endId: inspection.id }),
        },
        update: {
          userId: data.userId,
          ...(data.status === "INICIO"
            ? { startId: inspection.id }
            : { endId: inspection.id }),
        },
      })
      return { inspection, inspect }
    })
    return result
  } catch (error) {
    console.error('Transaction failed:', error)
    throw error
  }
}*/
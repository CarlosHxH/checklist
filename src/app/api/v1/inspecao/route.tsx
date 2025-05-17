// src/app/api/v1/inspecao/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma';
import { auth } from '@/auth';


/**
 * Handles multipart/form-data uploads for inspections
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get form data
    const formData = await req.formData();

    // Extract basic inspection data
    const inspectionData: any = {};

    // Process all form fields
    for (const [key, value] of formData.entries()) {
      // Skip photos and photoTypes as we'll handle them separately
      if (key !== 'photos' && key !== 'photoTypes') {
        // For boolean values
        if (value === 'true') {
          inspectionData[key] = true;
        } else if (value === 'false') {
          inspectionData[key] = false;
        } else {
          inspectionData[key] = value;
        }
      }
    }

    // Ensure required fields are present
    if (!inspectionData.userId || !inspectionData.vehicleId) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and vehicleId are required' },
        { status: 400 }
      );
    }

    // Parse boolean isFinished if needed
    if (typeof inspectionData.isFinished === 'string') {
      inspectionData.isFinished = inspectionData.isFinished === 'true';
    }

    // Create the inspection record
    const inspection = await prisma.inspection.create({
      data: {
        ...inspectionData,
        dataInspecao: new Date(),
        updatedAt: new Date(),
      },
    });

    // Process photos
    const photos = formData.getAll('photos');
    const photoTypesEntries = formData.getAll('photoTypes');

    if (photos.length > 0) {
      // Process each photo with its metadata
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i] as File;
        const photoTypeData = JSON.parse(photoTypesEntries[i] as string);

        // Read file as buffer
        const arrayBuffer = await photo.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Convert to base64
        const base64 = buffer.toString('base64');
        const photoType = `data:${photo.type};base64,${base64}`;

        // Create the photo record
        const photoRecord = await prisma.inspectionPhoto.create({
          data: {
            inspectionId: inspection.id,
            description: photoTypeData.description,
            photo: photoType,
            type: photoTypeData.type,
          },
        });

        // Link photo to specific relation based on type
        if (photoTypeData.type === 'documento') {
          await prisma.inspection.update({
            where: { id: inspection.id },
            data: {
              fotoDocumento: {
                connect: { id: photoRecord.id }
              }
            }
          });
        } else if (photoTypeData.type === 'tacografo') {
          await prisma.inspection.update({
            where: { id: inspection.id },
            data: {
              fotoTacografo: {
                connect: { id: photoRecord.id }
              }
            }
          });
        } else if (photoTypeData.type === 'extintor') {
          await prisma.inspection.update({
            where: { id: inspection.id },
            data: {
              fotoExtintor: {
                connect: { id: photoRecord.id }
              }
            }
          });
        } else if (photoTypeData.type === 'vehicle') {
          await prisma.inspection.update({
            where: { id: inspection.id },
            data: {
              fotoVeiculo: {
                connect: { id: photoRecord.id }
              }
            }
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Inspeção criada com sucesso',
      inspection: { id: inspection.id }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error saving inspection:', error);
    return NextResponse.json({ error: 'Failed to create inspection', details: error.message }, { status: 500 });
  }
}

/**
 * Get all inspections or filter by userId or vehicleId
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const vehicleId = url.searchParams.get('vehicleId');

    // Build filter based on query parameters
    const filter: any = {};
    if (userId) filter.userId = userId;
    if (vehicleId) filter.vehicleId = vehicleId;

    // Fetch inspections with related data
    const inspections = await prisma.inspection.findMany({
      where: filter,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          }
        },
        vehicle: {
          select: {
            id: true,
            plate: true,
            model: true,
          }
        },
        photos: true,
        fotoDocumento: true,
        fotoTacografo: true,
        fotoExtintor: true,
        fotoVeiculo: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(inspections);
  } catch (error: any) {
    console.error('Error fetching inspections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inspections', details: error.message },
      { status: 500 }
    );
  }
}
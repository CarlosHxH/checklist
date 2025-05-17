import { NextResponse } from 'next/server';
import { createInspectionWithTransaction } from './inspection.service';
import { fileToBase64 } from '@/utils';
import { setupFilePolyfill } from '@/utils/file-polyfill';
import { prisma } from '@/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Set up File polyfill before processing
setupFilePolyfill();

export async function POST(request: Request) {
  try {
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

    // Validate required fields
    if (!data.userId || !data.vehicleId || !data.status) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, vehicleId, or status' },
        { status: 400 }
      );
    }

    // Validate user exists
    const user = await prisma.user.findUnique({where: { id: data.userId }});
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Validate vehicle exists
    const vehicle = await prisma.vehicle.findUnique({where: { id: data.vehicleId }});
    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Convert isFinished to boolean
    data.isFinished = true;

    const result = await createInspectionWithTransaction(data);

    
    return NextResponse.json(result, { status: 201 });



  } catch (error) {
    console.error('Error processing form:', error);
    
    // Handle specific Prisma errors
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
      return NextResponse.json(
        { 
          error: 'Invalid reference to user or vehicle',
          details: 'The specified user or vehicle does not exist'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to process form', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
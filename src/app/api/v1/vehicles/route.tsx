import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function GET(request: NextRequest) {
  try {
    const vehicle = await prisma.vehicle.findMany();
    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error fetching:', error);
    return NextResponse.json({ error: 'Failed to fetch' },{ status: 500 });
  }
}
import { prisma } from '@/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const keys = await prisma.vehicleKey.findMany({
      where: {
        userId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          }
        },
        vehicle: {
          select: {
            id: true,
            plate: true,
            model: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(keys)
  } catch (error) {
    console.error('Error confirming transfer:', error)
    return NextResponse.json(
      { error: 'Error confirming transfer' },
      { status: 500 }
    )
  }
}
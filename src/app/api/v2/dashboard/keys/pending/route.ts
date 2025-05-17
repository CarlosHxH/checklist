import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/prisma'

export async function GET(request: NextRequest) {
  try {
    const pendingTransfers = await prisma.vehicleKey.findMany({
      where: {
        status: 'PENDING'
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

    return NextResponse.json(pendingTransfers)
  } catch (error) {
    console.error('Error fetching pending transfers:', error)
    return NextResponse.json(
      { error: 'Error fetching pending transfers' },
      { status: 500 }
    )
  }
}
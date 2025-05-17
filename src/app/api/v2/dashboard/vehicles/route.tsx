import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function GET() {
  try {
    const vehicle = await prisma.vehicle.findMany();
    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error fetching:', error);
    return NextResponse.json({ error: 'Failed to fetch' },{ status: 500 });
  }
}

export async function POST(request: Request) {
  const {id, ...data} = await request.json();
  if (!data) return NextResponse.json({ message: 'Is are required.' }, { status: 400 });
  try {
    const isExist = await prisma.vehicle.findUnique({where:{plate:data.plate}})
    if (isExist) {
      return NextResponse.json({ message: 'Veiculo já resgistrado!' }, { status: 403 });
    }
    const vehicle = await prisma.vehicle.create({data});
    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 403 });
  }
}

export async function PUT(request: NextRequest)
{
  try
  {
    const body = await request.json();
    const updateData = { ...body };
    delete updateData.id;
    const vehicle = await prisma.vehicle.update({
      where: { id: body.id },
      data: updateData,
    });
    return NextResponse.json(vehicle);
  } catch (error) {
    return NextResponse.json({ error: 'Falha ao atualizar o veículo' },{ status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest)
{
  try
  {
    const { id } = await request.json();
    await prisma.vehicle.delete({where: { id }});
    return NextResponse.json({ success: true });
  } catch (error)
  {
    console.error('Erro excluindo o veículo:', error);
    return NextResponse.json(
      { error: 'Falha ao excluir o veículo' },
      { status: 500 }
    );
  }
}
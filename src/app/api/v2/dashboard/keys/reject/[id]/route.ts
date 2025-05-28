import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/prisma'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  try {
    const id = (await params).id;
    const teste = await prisma.vehicleKey.findUnique({ where: { id, status: "PENDING" } })
    if (!teste) {
      return NextResponse.json({ error: 'Transferência pendente não encontrada!' }, { status: 404 })
    }
    const dell = await prisma.vehicleKey.delete({ where: { id, status: "PENDING" } })
    if (!dell) throw new Error('Transferência pendente não encontrada!');
    return NextResponse.json(dell, { status: 201 })
  } catch (error) {
    console.error('Erro, rejeitando a transferência:', error)
    return NextResponse.json({ error: 'Erro, rejeitando a transferência' }, { status: 500 })
  }
}
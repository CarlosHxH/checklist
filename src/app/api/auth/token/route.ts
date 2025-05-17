import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/prisma";
import { encoded } from "@/jwt";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json({ error: "Credenciais inválidas" },{ status: 403 });
    }
    const { id, role } = user;
    const token = await encoded({
      user: {
        id,
        username,
        role,
      }
    });
    
    if(!token){
      return NextResponse.json({ error: "Erro interno do servidor" },{ status: 403 });
    }
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" },{ status: 403 });
  }
}
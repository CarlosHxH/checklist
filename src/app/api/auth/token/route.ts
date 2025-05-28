import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/prisma";
import { decoded, encoded } from "@/webToken";

export async function GET(request: NextRequest) {
  try {
    const authHeader = await request.headers//.get('authorization');
    console.log({authHeader});
    /*
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 }
      );
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 403 });
    }*/

    //const decode = await decoded(authHeader);
    return NextResponse.json( authHeader );
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 403 });
    }
    const { id, role } = user;
    const token = await encoded({
      user: {
        id,
        username,
        role,
      }
    });

    if (!token) {
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 403 });
    }
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 403 });
  }
}
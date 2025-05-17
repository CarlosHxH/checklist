import { NextResponse } from "next/server";

export async function GET(request: Request) {
    return NextResponse.json({ error: "Not Found", status: 404 }, { status: 404 });
}

export async function HEAD(request: Request) {}

export async function POST(request: Request) {}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}

export async function PATCH(request: Request) {}

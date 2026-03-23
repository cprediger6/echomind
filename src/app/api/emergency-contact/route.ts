// src/app/api/emergency-contact/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { name, relationship, email, phone, userId } = await request.json();
  if (userId !== session.user.id)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const contact = await prisma.emergencyContact.upsert({
      where: { userId },
      update: { name, relationship, email, phone },
      create: { userId, name, relationship, email, phone },
    });
    return NextResponse.json({ success: true, contact });
  } catch (error) {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request); // misma lógica (upsert)
}

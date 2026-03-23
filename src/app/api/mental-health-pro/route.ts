// src/app/api/mental-health-pro/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { name, specialty, email, phone, clinic, userId } =
    await request.json();
  if (userId !== session.user.id)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const pro = await prisma.mentalHealthProfessional.upsert({
      where: { userId },
      update: { name, specialty, email, phone, clinic },
      create: { userId, name, specialty, email, phone, clinic },
    });
    return NextResponse.json({ success: true, pro });
  } catch (error) {
    console.error("Error en mental-health-pro:", error);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

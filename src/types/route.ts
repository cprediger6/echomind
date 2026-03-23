// src/app/api/typing/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { typingSpeed, errorRate, pauseCount, sessionTime } =
      await request.json();

    // Validaciones básicas
    if (
      typingSpeed === undefined ||
      errorRate === undefined ||
      pauseCount === undefined ||
      sessionTime === undefined
    ) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const pattern = await prisma.typingPattern.create({
      data: {
        userId: session.user.id,
        typingSpeed,
        errorRate,
        pauseCount,
        sessionTime,
      },
    });

    return NextResponse.json({ success: true, pattern });
  } catch (error) {
    console.error("Error al guardar patrón:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

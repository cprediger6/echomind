// src/app/api/beck/history/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const history = await prisma.beckInventory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        totalScore: true,
        level: true,
      },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error obteniendo historial de Beck:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
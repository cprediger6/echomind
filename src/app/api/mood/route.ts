import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { moodScore, note } = await request.json();
    if (typeof moodScore !== "number" || moodScore < 1 || moodScore > 5) {
      return NextResponse.json(
        { error: "Puntuación inválida" },
        { status: 400 },
      );
    }

    // Solo permitir una entrada por día (sobrescribe si ya existe hoy)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existing = await prisma.moodEntry.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    let entry;
    if (existing) {
      entry = await prisma.moodEntry.update({
        where: { id: existing.id },
        data: { moodScore, note },
      });
    } else {
      entry = await prisma.moodEntry.create({
        data: {
          userId: session.user.id,
          moodScore,
          note,
          date: today,
        },
      });
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    // Últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const entries = await prisma.moodEntry.findMany({
      where: {
        userId: session.user.id,
        date: { gte: thirtyDaysAgo },
      },
      orderBy: { date: "asc" },
    });
    return NextResponse.json(entries);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    // 1. Obtener todos los patrones de escritura de los últimos 30 días
    const typingPatterns = await prisma.typingPattern.findMany({
      where: {
        userId: session.user.id,
        timestamp: { gte: thirtyDaysAgo },
      },
      select: {
        timestamp: true,
        typingSpeed: true,
        errorRate: true,
      },
      orderBy: { timestamp: "asc" },
    });

    // 2. Obtener todos los registros de sueño nocturno de los últimos 30 días
    const sleepLogs = await prisma.fitbitSleepLog.findMany({
      where: {
        userId: session.user.id,
        isMainSleep: true,
        startTime: { gte: thirtyDaysAgo },
      },
      select: {
        startTime: true,
        duration: true,
        efficiency: true,
      },
      orderBy: { startTime: "asc" },
    });

    // 3. Obtener todas las entradas de ánimo de los últimos 30 días
    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        userId: session.user.id,
        date: { gte: thirtyDaysAgo },
      },
      select: {
        date: true,
        moodScore: true,
      },
      orderBy: { date: "asc" },
    });

    // Crear un mapa para acumular datos por día (formato YYYY-MM-DD)
    const dailyData: Record<
      string,
      {
        typingSpeeds: number[];
        errorRates: number[];
        sleepDuration: number | null;
        sleepEfficiency: number | null;
        moodScore: number | null;
      }
    > = {};

    // Inicializar todos los días del rango para tener valores nulos
    const startDate = new Date(thirtyDaysAgo);
    const endDate = new Date();
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateKey = d.toISOString().split("T")[0];
      dailyData[dateKey] = {
        typingSpeeds: [],
        errorRates: [],
        sleepDuration: null,
        sleepEfficiency: null,
        moodScore: null,
      };
    }

    // Procesar escritura (pueden haber múltiples registros por día)
    typingPatterns.forEach(
      (p: { timestamp: Date; typingSpeed: number; errorRate: number }) => {
        const dateKey = p.timestamp.toISOString().split("T")[0];
        if (dailyData[dateKey]) {
          dailyData[dateKey].typingSpeeds.push(p.typingSpeed);
          dailyData[dateKey].errorRates.push(p.errorRate);
        }
      },
    );

    // Procesar sueño (asumimos solo un registro por día)
    sleepLogs.forEach(
      (sleep: {
        startTime: Date;
        duration: number;
        efficiency: number | null;
      }) => {
        const dateKey = sleep.startTime.toISOString().split("T")[0];
        if (dailyData[dateKey]) {
          dailyData[dateKey].sleepDuration = sleep.duration;
          dailyData[dateKey].sleepEfficiency = sleep.efficiency;
        }
      },
    );

    // Procesar ánimo (asumimos solo un registro por día)
    moodEntries.forEach((mood: { date: Date; moodScore: number }) => {
      const dateKey = mood.date.toISOString().split("T")[0];
      if (dailyData[dateKey]) {
        dailyData[dateKey].moodScore = mood.moodScore;
      }
    });

    // Convertir a array de objetos con valores agregados
    const reportData = Object.entries(dailyData)
      .map(([date, data]) => {
        // Promedio de velocidad y error si hay datos
        const avgTypingSpeed = data.typingSpeeds.length
          ? data.typingSpeeds.reduce((a, b) => a + b, 0) /
            data.typingSpeeds.length
          : null;
        const avgErrorRate = data.errorRates.length
          ? data.errorRates.reduce((a, b) => a + b, 0) / data.errorRates.length
          : null;

        return {
          date,
          typingSpeed: avgTypingSpeed,
          errorRate: avgErrorRate,
          sleepDuration: data.sleepDuration,
          sleepEfficiency: data.sleepEfficiency,
          moodScore: data.moodScore,
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json(reportData);
  } catch (error) {
    console.error("Error generando reporte:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

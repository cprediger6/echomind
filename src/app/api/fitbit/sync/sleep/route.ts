// src/app/api/fitbit/sync/sleep/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getValidFitbitToken } from "@/lib/fitbit";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    // Obtener dispositivo conectado
    const device = await prisma.connectedDevice.findUnique({
      where: {
        userId_provider: {
          userId: session.user.id,
          provider: "fitbit",
        },
      },
    });

    if (!device) {
      return NextResponse.json(
        { error: "Dispositivo no conectado" },
        { status: 404 },
      );
    }

    // Obtener token válido (refrescar si es necesario)
    const validDevice = await getValidFitbitToken(device);

    // Obtener últimos 30 días de sueño
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    const response = await fetch(
      `https://api.fitbit.com/1.2/user/${device.providerUserId}/sleep/date/${formatDate(startDate)}/${formatDate(endDate)}.json`,
      {
        headers: {
          Authorization: `Bearer ${validDevice.accessToken}`,
        },
      },
    );

    const sleepData = await response.json();

    if (!response.ok) {
      throw new Error("Error obteniendo datos de sueño");
    }

    // Guardar cada registro de sueño
    for (const sleep of sleepData.sleep) {
      await prisma.fitbitSleepLog.upsert({
        where: { logId: sleep.logId.toString() },
        update: {
          startTime: new Date(sleep.startTime),
          endTime: new Date(sleep.endTime),
          duration: sleep.duration / 60000, // convertir a minutos
          efficiency: sleep.efficiency,
          minutesAsleep: sleep.minutesAsleep,
          minutesAwake: sleep.minutesAwake,
          minutesToFallAsleep: sleep.minutesToFallAsleep,
          timeInBed: sleep.timeInBed,
          sleepLevelDeep: sleep.levels?.summary?.deep?.minutes,
          sleepLevelLight: sleep.levels?.summary?.light?.minutes,
          sleepLevelRem: sleep.levels?.summary?.rem?.minutes,
          sleepLevelWake: sleep.levels?.summary?.wake?.minutes,
          isMainSleep: sleep.isMainSleep,
          dataSource: "fitbit",
        },
        create: {
          userId: session.user.id,
          logId: sleep.logId.toString(),
          startTime: new Date(sleep.startTime),
          endTime: new Date(sleep.endTime),
          duration: sleep.duration / 60000,
          efficiency: sleep.efficiency,
          minutesAsleep: sleep.minutesAsleep,
          minutesAwake: sleep.minutesAwake,
          minutesToFallAsleep: sleep.minutesToFallAsleep,
          timeInBed: sleep.timeInBed,
          sleepLevelDeep: sleep.levels?.summary?.deep?.minutes,
          sleepLevelLight: sleep.levels?.summary?.light?.minutes,
          sleepLevelRem: sleep.levels?.summary?.rem?.minutes,
          sleepLevelWake: sleep.levels?.summary?.wake?.minutes,
          isMainSleep: sleep.isMainSleep,
          dataSource: "fitbit",
        },
      });
    }

    // Actualizar última sincronización
    await prisma.connectedDevice.update({
      where: { id: device.id },
      data: { lastSyncedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      synced: sleepData.sleep.length,
    });
  } catch (error) {
    console.error("Error sincronizando sueño:", error);
    return NextResponse.json(
      { error: "Error sincronizando datos" },
      { status: 500 },
    );
  }
}

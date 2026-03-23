// src/app/api/fitbit/disconnect/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    await prisma.connectedDevice.delete({
      where: {
        userId_provider: {
          userId: session.user.id,
          provider: "fitbit",
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error desconectando Fitbit:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

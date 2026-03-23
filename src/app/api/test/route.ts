// src/app/api/test/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Intentar conectar
    await prisma.$connect();

    // Hacer una consulta simple
    const result = await prisma.$queryRaw("SELECT 1+1 as sum");

    return NextResponse.json({
      success: true,
      message: "✅ Conectado a Neon",
      result,
    });
  } catch (error: any) {
    console.error("Error detallado:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        stack: error.stack,
      },
      { status: 500 },
    );
  }
}

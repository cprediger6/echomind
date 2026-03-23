import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

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

    // Si la tasa de errores es alta, enviar alertas
    if (errorRate > 15) {
      // Crear alerta en BD (sin asignar a variable)
      await prisma.alert.create({
        data: {
          userId: session.user.id,
          type: "TYPING_CHANGE",
          severity: errorRate,
          message: "Tasa de errores alta en escritura",
        },
      });

      // Obtener contactos del usuario (usamos findFirst porque userId no es único)
      const emergency = await prisma.emergencyContact.findFirst({
        where: { userId: session.user.id },
      });
      const pro = await prisma.mentalHealthProfessional.findFirst({
        where: { userId: session.user.id },
      });

      // Plantilla de correo (usamos un HTML simple, sin depender de una función externa)
      const subject = `Alerta: Tasa de errores alta en escritura (${errorRate.toFixed(1)}%)`;
      const html = `<p>La persona <strong>${session.user.name || "Persona"}</strong> ha presentado una tasa de errores alta (${errorRate.toFixed(1)}%) al escribir.</p>
                    <p>Por favor, contacta con ella si lo consideras necesario.</p>`;

      // Enviar correos si existen los contactos
      if (emergency) {
        try {
          await sendEmail(emergency.email, subject, html);
        } catch (error) {
          console.error("Error enviando a contacto de emergencia:", error);
        }
      }
      if (pro) {
        try {
          await sendEmail(pro.email, subject, html);
        } catch (error) {
          console.error("Error enviando a profesional:", error);
        }
      }
    }

    return NextResponse.json({ success: true, pattern });
  } catch (error) {
    console.error("Error al guardar patrón:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

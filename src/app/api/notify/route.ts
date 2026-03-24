import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const [emergency, professional] = await Promise.all([
      prisma.emergencyContact.findFirst({
        where: { userId: session.user.id },
      }),
      prisma.mentalHealthProfessional.findFirst({
        where: { userId: session.user.id },
      }),
    ]);

    const contacts = [emergency, professional].filter(Boolean);

    const message = `
      <h2>⚠️ Alerta de apoyo - EchoMind</h2>
      <p>Una persona cercana podría necesitar apoyo emocional.</p>
      <p>Te recomendamos comunicarte con ella lo antes posible.</p>
    `;

    for (const contact of contacts) {
      if (contact?.email) {
        await sendEmail(contact.email, "⚠️ Alerta de apoyo emocional", message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error enviando notificaciones" },
      { status: 500 },
    );
  }
}

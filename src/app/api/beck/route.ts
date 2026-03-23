// src/app/api/beck/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { beckAlertTemplate } from "@/lib/emailTemplates";

async function sendEmailNotifications(
  userId: string,
  userName: string,
  totalScore: number,
  level: string,
) {
  const [emergency, professional] = await Promise.all([
    prisma.emergencyContact.findFirst({ where: { userId } }),
    prisma.mentalHealthProfessional.findFirst({ where: { userId } }),
  ]);

  const subject = `Alerta: Resultado de test de Beck (${level})`;
  const html = beckAlertTemplate(userName, totalScore, level, new Date());

  const emailPromises = [];

  if (emergency?.email) {
    emailPromises.push(sendEmail(emergency.email, subject, html));
  }

  if (professional?.email) {
    emailPromises.push(sendEmail(professional.email, subject, html));
  }

  await Promise.allSettled(emailPromises);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { userId, answers, totalScore, level } = await request.json();

    if (userId !== session.user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const result = await prisma.beckInventory.create({
      data: {
        userId,
        answers,
        totalScore,
        level,
      },
    });

    const showAlert = level === "moderado" || level === "severo";

    // Email en background
    if (showAlert) {
      sendEmailNotifications(
        userId,
        session.user.name || "Usuario",
        totalScore,
        level,
      ).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      result,
      showAlert,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

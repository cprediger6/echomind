// src/app/api/contacts/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const [emergency, professional] = await Promise.all([
    prisma.emergencyContact.findFirst({
      where: { userId: session.user.id },
    }),
    prisma.mentalHealthProfessional.findFirst({
      where: { userId: session.user.id },
    }),
  ]);

  const contacts = [];

  if (emergency?.phone) {
    contacts.push({
      name: emergency.name || "Contacto de emergencia",
      phone: emergency.phone,
    });
  }

  if (professional?.phone) {
    contacts.push({
      name: professional.name || "Profesional",
      phone: professional.phone,
    });
  }

  return NextResponse.json({ contacts });
}

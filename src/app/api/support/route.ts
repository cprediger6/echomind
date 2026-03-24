import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const { contacts, message } = await req.json();

    if (!contacts || contacts.length === 0) {
      return NextResponse.json({ error: "No hay contactos" }, { status: 400 });
    }
    type Contact = {
      name: string;
      phone: string;
      email?: string;
    };

    await Promise.all(
      contacts.map((contact: Contact) => {
        if (!contact.email) return null;

        return sendEmail({
          to: contact.email,
          subject: "🚨 Alerta de bienestar - EchoMind",
          html: `
        <h2>Alerta de apoyo</h2>
        <p>Un usuario ha solicitado ayuda.</p>
        <p><strong>Mensaje:</strong> ${message}</p>
      `,
        });
      }),
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ ERROR API SUPPORT:", error);

    return NextResponse.json(
      { error: "Error enviando notificaciones" },
      { status: 500 },
    );
  }
}

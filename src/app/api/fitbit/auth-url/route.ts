// src/app/api/fitbit/auth-url/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const FITBIT_CLIENT_ID = process.env.FITBIT_CLIENT_ID;
const FITBIT_REDIRECT_URI = process.env.FITBIT_REDIRECT_URI;

// Scopes necesarios para leer datos de sueño y actividad
const SCOPES = ["activity", "heartrate", "sleep", "profile"].join(" ");

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Generar un estado aleatorio para prevenir CSRF
  const state = Buffer.from(
    JSON.stringify({
      userId: session.user.id,
      timestamp: Date.now(),
    }),
  ).toString("base64");

  // Construir URL de autorización de Fitbit
  const authUrl = new URL("https://www.fitbit.com/oauth2/authorize");
  authUrl.searchParams.append("client_id", FITBIT_CLIENT_ID!);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("scope", SCOPES);
  authUrl.searchParams.append("redirect_uri", FITBIT_REDIRECT_URI!);
  authUrl.searchParams.append("state", state);
  authUrl.searchParams.append("expires_in", "2592000"); // 30 días

  return NextResponse.json({ url: authUrl.toString() });
}

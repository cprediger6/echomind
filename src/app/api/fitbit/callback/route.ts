// src/app/api/fitbit/callback/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    console.error("Error en autorización Fitbit:", error);
    return NextResponse.redirect(new URL("/fitbit/error", request.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/fitbit/error", request.url));
  }

  try {
    // Decodificar el estado para obtener el userId
    const stateData = JSON.parse(Buffer.from(state, "base64").toString());
    const userId = stateData.userId;

    // Intercambiar el código por tokens
    const tokenResponse = await fetch("https://api.fitbit.com/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`,
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.FITBIT_CLIENT_ID!,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.FITBIT_REDIRECT_URI!,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Error obteniendo tokens:", tokenData);
      return NextResponse.redirect(new URL("/fitbit/error", request.url));
    }

    // Obtener información del usuario de Fitbit
    const profileResponse = await fetch(
      "https://api.fitbit.com/1/user/-/profile.json",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      },
    );

    const profileData = await profileResponse.json();

    // Calcular fecha de expiración del token
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);

    // Guardar o actualizar el dispositivo conectado
    await prisma.connectedDevice.upsert({
      where: {
        userId_provider: {
          userId,
          provider: "fitbit",
        },
      },
      update: {
        providerUserId: profileData.user.encodedId,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt: expiresAt,
        scope: tokenData.scope,
        lastSyncedAt: new Date(),
      },
      create: {
        userId,
        provider: "fitbit",
        providerUserId: profileData.user.encodedId,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt: expiresAt,
        scope: tokenData.scope,
      },
    });

    // Redirigir al dashboard con mensaje de éxito
    return NextResponse.redirect(
      new URL("/dashboard?fitbit=connected", request.url),
    );
  } catch (error) {
    console.error("Error en callback Fitbit:", error);
    return NextResponse.redirect(new URL("/fitbit/error", request.url));
  }
}

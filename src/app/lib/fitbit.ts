// src/lib/fitbit.ts
import { prisma } from "./prisma";
import { ConnectedDevice } from "@prisma/client";

export async function refreshFitbitToken(device: ConnectedDevice) {
  try {
    const response = await fetch("https://api.fitbit.com/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`,
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: device.refreshToken,
      }),
    });

    const tokenData = await response.json();

    if (!response.ok) {
      throw new Error("Error refrescando token");
    }

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);

    const updated = await prisma.connectedDevice.update({
      where: { id: device.id },
      data: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt: expiresAt,
      },
    });

    return updated;
  } catch (error) {
    console.error("Error refrescando token Fitbit:", error);
    throw error;
  }
}

export async function getValidFitbitToken(device: ConnectedDevice) {
  const fiveMinutesFromNow = new Date();
  fiveMinutesFromNow.setMinutes(fiveMinutesFromNow.getMinutes() + 5);

  if (new Date(device.tokenExpiresAt) < fiveMinutesFromNow) {
    return await refreshFitbitToken(device);
  }

  return device;
}

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Nav from "@/components/nav";
import PieDePagina from "@/components/PieDePagina";
import DashboardClient from "@/components/DashboardClient";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const fitbitDevice = await prisma.connectedDevice.findUnique({
    where: {
      userId_provider: {
        userId: session.user.id,
        provider: "fitbit",
      },
    },
  });
  const userHasFitbit = !!fitbitDevice;

  const latestSleep = await prisma.fitbitSleepLog.findFirst({
    where: { userId: session.user.id, isMainSleep: true },
    orderBy: { startTime: "desc" },
  });

  const emergencyContact = await prisma.emergencyContact.findFirst({
    where: { userId: session.user.id },
  });
  const mentalHealthPro = await prisma.mentalHealthProfessional.findFirst({
    where: { userId: session.user.id },
  });

  const missingContacts = [];
  if (!emergencyContact) missingContacts.push("contacto de emergencia");
  if (!mentalHealthPro) missingContacts.push("profesional de salud mental");

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <DashboardClient
        userId={session.user.id}
        user={{
          email: session.user.email,
          createdAt: session.user.createdAt ?? null,
        }}
        userHasFitbit={userHasFitbit}
        latestSleep={latestSleep}
        emergencyContact={emergencyContact}
        mentalHealthPro={mentalHealthPro}
        missingContacts={missingContacts}
      />
      <PieDePagina />
    </div>
  );
}

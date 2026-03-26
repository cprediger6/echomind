import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Nav from "@/components/nav";
import PieDePagina from "@/components/PieDePagina";
import ReportCharts from "@/components/ReportCharts";

type TypingPatternSelect = {
  timestamp: Date;
  typingSpeed: number;
  errorRate: number;
};

type SleepLogSelect = {
  startTime: Date;
  duration: number;
  efficiency: number | null;
};

type MoodEntrySelect = {
  date: Date;
  moodScore: number;
};

export default async function ReportPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const typingPatterns = await prisma.typingPattern.findMany({
    where: {
      userId: session.user.id,
      timestamp: { gte: thirtyDaysAgo },
    },
    select: { timestamp: true, typingSpeed: true, errorRate: true },
    orderBy: { timestamp: "asc" },
  });

  const sleepLogs = await prisma.fitbitSleepLog.findMany({
    where: {
      userId: session.user.id,
      isMainSleep: true,
      startTime: { gte: thirtyDaysAgo },
    },
    select: { startTime: true, duration: true, efficiency: true },
    orderBy: { startTime: "asc" },
  });

  const moodEntries = await prisma.moodEntry.findMany({
    where: {
      userId: session.user.id,
      date: { gte: thirtyDaysAgo },
    },
    select: { date: true, moodScore: true },
    orderBy: { date: "asc" },
  });

  const dailyData: Record<
    string,
    {
      typingSpeeds: number[];
      errorRates: number[];
      sleepDuration: number | null;
      sleepEfficiency: number | null;
      moodScore: number | null;
    }
  > = {};

  const startDate = new Date(thirtyDaysAgo);
  const endDate = new Date();
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateKey = d.toISOString().split("T")[0];
    dailyData[dateKey] = {
      typingSpeeds: [],
      errorRates: [],
      sleepDuration: null,
      sleepEfficiency: null,
      moodScore: null,
    };
  }

  typingPatterns.forEach((p: TypingPatternSelect) => {
    const dateKey = p.timestamp.toISOString().split("T")[0];
    if (dailyData[dateKey]) {
      dailyData[dateKey].typingSpeeds.push(p.typingSpeed);
      dailyData[dateKey].errorRates.push(p.errorRate);
    }
  });

  sleepLogs.forEach((sleep: SleepLogSelect) => {
    const dateKey = sleep.startTime.toISOString().split("T")[0];
    if (dailyData[dateKey]) {
      dailyData[dateKey].sleepDuration = sleep.duration;
      dailyData[dateKey].sleepEfficiency = sleep.efficiency;
    }
  });

  moodEntries.forEach((mood: MoodEntrySelect) => {
    const dateKey = mood.date.toISOString().split("T")[0];
    if (dailyData[dateKey]) {
      dailyData[dateKey].moodScore = mood.moodScore;
    }
  });

  const reportData = Object.entries(dailyData)
    .map(([date, data]) => {
      const avgTypingSpeed = data.typingSpeeds.length
        ? data.typingSpeeds.reduce((a, b) => a + b, 0) /
          data.typingSpeeds.length
        : null;
      const avgErrorRate = data.errorRates.length
        ? data.errorRates.reduce((a, b) => a + b, 0) / data.errorRates.length
        : null;

      return {
        date,
        typingSpeed: avgTypingSpeed,
        errorRate: avgErrorRate,
        sleepDuration: data.sleepDuration,
        sleepEfficiency: data.sleepEfficiency,
        moodScore: data.moodScore,
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            ← Volver al dashboard
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Informe combinado
        </h1>
        <p className="text-gray-600 mb-8">
          Visualiza la relación entre tu escritura, sueño y estado de ánimo en
          los últimos 30 días.
        </p>
        <ReportCharts data={reportData} />
      </div>
      <PieDePagina />
    </div>
  );
}

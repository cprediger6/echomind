"use client";

interface SleepData {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // minutos
  efficiency: number | null;
  minutesAsleep: number;
  minutesAwake: number;
  minutesToFallAsleep: number | null;
  timeInBed: number;
  sleepLevelDeep: number | null;
  sleepLevelLight: number | null;
  sleepLevelRem: number | null;
  sleepLevelWake: number | null;
  isMainSleep: boolean;
}

interface SleepSummaryCardProps {
  sleepData: SleepData | null;
}

export default function SleepSummaryCard({ sleepData }: SleepSummaryCardProps) {
  if (!sleepData) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-3xl mb-2">🌙</div>
        <h3 className="font-semibold text-lg">Sueño</h3>
        <p className="text-sm text-gray-500">Última noche</p>
        <div className="mt-2 text-gray-400">
          <p>No hay datos aún</p>
          <p className="text-xs mt-1">Conecta Fitbit y sincroniza</p>
        </div>
      </div>
    );
  }

  // Convertir duración a horas y minutos
  const hours = Math.floor(sleepData.duration / 60);
  const minutes = sleepData.duration % 60;
  const durationStr = `${hours}h ${minutes}m`;

  const efficiency = sleepData.efficiency ? `${sleepData.efficiency}%` : "N/A";

  // Preparar fases del sueño
  const stages = [
    {
      name: "Profundo",
      minutes: sleepData.sleepLevelDeep,
      color: "bg-blue-600",
    },
    {
      name: "Ligero",
      minutes: sleepData.sleepLevelLight,
      color: "bg-blue-400",
    },
    { name: "REM", minutes: sleepData.sleepLevelRem, color: "bg-blue-300" },
    {
      name: "Despierto",
      minutes: sleepData.sleepLevelWake,
      color: "bg-gray-400",
    },
  ].filter((s) => s.minutes !== null && s.minutes > 0);

  const totalStageMinutes = stages.reduce(
    (sum, s) => sum + (s.minutes || 0),
    0,
  );
  const date = new Date(sleepData.startTime).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="text-3xl mb-2">🌙</div>
      <h3 className="font-semibold text-lg">Sueño</h3>
      <p className="text-sm text-gray-500">{date}</p>
      <div className="mt-2 space-y-2">
        <p className="text-sm">
          <span className="font-bold">Duración:</span> {durationStr}
        </p>
        {sleepData.efficiency && (
          <p className="text-sm">
            <span className="font-bold">Eficiencia:</span> {efficiency}
          </p>
        )}
        {stages.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Fases del sueño</p>
            <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
              {stages.map((stage) => (
                <div
                  key={stage.name}
                  className={`${stage.color}`}
                  style={{
                    width: `${((stage.minutes || 0) / totalStageMinutes) * 100}%`,
                  }}
                ></div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-1 text-xs">
              {stages.map((stage) => (
                <div key={stage.name} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                  <span>
                    {stage.name}: {stage.minutes} min
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

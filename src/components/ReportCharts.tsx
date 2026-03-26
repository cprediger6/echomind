"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";

interface ReportDataPoint {
  date: string;
  typingSpeed: number | null;
  errorRate: number | null;
  sleepDuration: number | null;
  sleepEfficiency: number | null;
  moodScore: number | null;
}

interface ReportChartsProps {
  data: ReportDataPoint[];
}

export default function ReportCharts({ data }: ReportChartsProps) {
  // Filtrar datos nulos para cada gráfico (mostrar solo días con datos)
  const typingMoodData = data.filter(
    (d) => d.typingSpeed !== null && d.moodScore !== null,
  );
  const sleepMoodData = data.filter(
    (d) => d.sleepDuration !== null && d.moodScore !== null,
  );
  const errorSleepData = data.filter(
    (d) => d.errorRate !== null && d.sleepEfficiency !== null,
  );

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No hay suficientes datos para mostrar el informe. Completa más pruebas
        de escritura, sincroniza Fitbit o registra tu estado de ánimo.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Gráfico 1: Velocidad de escritura vs Estado de ánimo */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">
          Velocidad de escritura vs Estado de ánimo
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Compara tu velocidad de escritura (cps) con tu estado de ánimo diario
          (1-5).
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={typingMoodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              yAxisId="left"
              label={{
                value: "Velocidad (cps)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: "Ánimo (1-5)",
                angle: 90,
                position: "insideRight",
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="typingSpeed"
              name="Velocidad (cps)"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="moodScore"
              name="Estado de ánimo"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico 2: Duración del sueño vs Estado de ánimo */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">
          Duración del sueño vs Estado de ánimo
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Compara las horas de sueño con tu estado de ánimo.
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={sleepMoodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              yAxisId="left"
              label={{
                value: "Horas de sueño",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: "Ánimo (1-5)",
                angle: 90,
                position: "insideRight",
              }}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "Horas de sueño")
                  return `${((value as number) / 60).toFixed(1)} h`;
                return value;
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="sleepDuration"
              name="Horas de sueño"
              fill="#f59e0b"
              barSize={30}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="moodScore"
              name="Estado de ánimo"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico 3: Tasa de errores vs Eficiencia del sueño */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">
          Tasa de errores vs Eficiencia del sueño
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Relación entre errores al escribir y la eficiencia de tu sueño (%).
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={errorSleepData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              yAxisId="left"
              label={{
                value: "Tasa de errores (%)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: "Eficiencia sueño (%)",
                angle: 90,
                position: "insideRight",
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="errorRate"
              name="Tasa de errores (%)"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="sleepEfficiency"
              name="Eficiencia sueño (%)"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

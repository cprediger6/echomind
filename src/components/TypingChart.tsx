// src/components/TypingChart.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TypingData {
  id: string;
  timestamp: Date;
  typingSpeed: number;
  errorRate: number;
  pauseCount: number;
  sessionTime: number;
}

interface TypingChartProps {
  data: TypingData[];
}

export default function TypingChart({ data }: TypingChartProps) {
  // Formatear los datos para la gráfica
  const chartData = data.map((item) => ({
    ...item,
    date: new Date(item.timestamp).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
    }),
    typingSpeed: Math.round(item.typingSpeed * 10) / 10,
    errorRate: Math.round(item.errorRate * 10) / 10,
  }));

  if (!data.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay suficientes datos para mostrar la gráfica.
      </div>
    );
  }

  return (
    // Eliminamos el div envolvente con h-80 y usamos height fijo en ResponsiveContainer
    <ResponsiveContainer width="100%" height={320}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="typingSpeed"
          name="Velocidad (cps)"
          stroke="#3b82f6"
          activeDot={{ r: 8 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="errorRate"
          name="Tasa de error (%)"
          stroke="#ef4444"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

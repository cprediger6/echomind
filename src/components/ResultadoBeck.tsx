"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

interface Test {
  id: string;
  createdAt: string;
  totalScore: number;
  level: string;
}

interface Props {
  test: {
    id: string;
    createdAt: Date;
    totalScore: number;
    level: string;
    answers?: any;
  };
}

export default function ResultadoBeck({ test }: Props) {
  const [history, setHistory] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/beck/history");
        const data = await res.json();
        setHistory(data);
      } catch (error) {
        console.error("Error al cargar historial:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getColorByLevel = (level: string) => {
    switch (level) {
      case "mínimo":
        return "text-green-600";
      case "leve":
        return "text-yellow-600";
      case "moderado":
        return "text-orange-600";
      case "severo":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Tarjeta del último resultado */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Último resultado</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Fecha</p>
            <p className="text-lg font-medium">
              {new Date(test.createdAt).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Puntuación total</p>
            <p className="text-4xl font-bold text-blue-600">
              {test.totalScore}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Nivel de síntomas</p>
            <p className={`text-2xl font-bold ${getColorByLevel(test.level)}`}>
              {test.level.charAt(0).toUpperCase() + test.level.slice(1)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Interpretación</p>
            <p className="text-sm text-gray-700">
              {test.totalScore <= 13 &&
                "Síntomas mínimos. No se requiere intervención."}
              {test.totalScore > 13 &&
                test.totalScore <= 19 &&
                "Síntomas leves. Puede ser útil monitorear."}
              {test.totalScore > 19 &&
                test.totalScore <= 28 &&
                "Síntomas moderados. Considere buscar apoyo profesional."}
              {test.totalScore > 28 &&
                "Síntomas severos. Se recomienda consultar a un profesional de salud mental."}
            </p>
          </div>
        </div>
      </div>

      {/* Historial con gráfica */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">
          Evolución de tus resultados
        </h2>
        {loading ? (
          <p className="text-gray-500">Cargando historial...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500">
            Aún no hay suficientes datos para mostrar evolución.
          </p>
        ) : (
          <>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="createdAt"
                    tickFormatter={formatDate}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis domain={[0, 63]} />
                  <Tooltip
                    labelFormatter={(label) => formatDate(label as string)}
                    formatter={(value) => [
                      `${Number(value) || 0} puntos`,
                      "Puntuación",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalScore"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Puntaje
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nivel
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {item.totalScore}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <span
                          className={`font-medium ${getColorByLevel(item.level)}`}
                        >
                          {item.level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between">
        <Link
          href="/dashboard"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Volver al dashboard
        </Link>
        <Link
          href="/beck"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Realizar nuevo test
        </Link>
      </div>
    </div>
  );
}

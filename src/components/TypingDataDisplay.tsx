"use client";

import { useState, useEffect, useCallback } from "react";
import TypingChart from "./TypingChart";
import TypingTest from "./TypingTest";

interface TypingPattern {
  id: string;
  timestamp: string;
  typingSpeed: number;
  errorRate: number;
  pauseCount: number;
  sessionTime: number;
}

interface TypingDataDisplayProps {
  userId: string;
  refreshTrigger: number;
  onSaveComplete: () => void;
}

export default function TypingDataDisplay({
  userId,
  refreshTrigger,
  onSaveComplete,
}: TypingDataDisplayProps) {
  const [patterns, setPatterns] = useState<TypingPattern[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/typing?limit=30");
      if (!res.ok) throw new Error("Error fetching data");
      const data = await res.json();
      setPatterns(data);
    } catch (error) {
      console.error("Failed to fetch typing data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  const recentTests = [...patterns].reverse().slice(0, 5);
  const lastPattern = patterns[patterns.length - 1];

  if (loading && patterns.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Gráfica */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Tendencias de escritura</h3>
        {patterns.length > 0 ? (
          <TypingChart
            data={patterns.map((p) => ({
              ...p,
              timestamp: new Date(p.timestamp),
            }))}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay suficientes datos para mostrar la gráfica.
          </div>
        )}
      </div>

      {/* Tabla de pruebas recientes */}
      {recentTests.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Últimas pruebas de escritura
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Velocidad (cps)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Errores (%)
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pausas
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duración (s)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTests.map((test) => (
                  <tr key={test.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {new Date(test.timestamp).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {test.typingSpeed.toFixed(1)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {test.errorRate.toFixed(1)}%
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {test.pauseCount}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {test.sessionTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Test */}
      <TypingTest userId={userId} onSaveComplete={onSaveComplete} />

      {/* Alerta */}
      {lastPattern && lastPattern.errorRate > 15 && (
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <span className="text-yellow-400 text-xl mr-3">⚠️</span>
            <div>
              <p className="font-bold text-yellow-700">
                Notamos algo diferente
              </p>
              <p className="text-sm text-yellow-600">
                Tu tasa de errores al escribir ha aumentado. ¿Todo bien?
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

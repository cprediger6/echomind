"use client";

import { useState, useEffect, useCallback } from "react";

interface TypingPattern {
  id: string;
  timestamp: string;
  typingSpeed: number;
  errorRate: number;
  pauseCount: number;
  sessionTime: number;
}

interface TypingMetricsCardProps {
  refreshTrigger: number;
}

export default function TypingMetricsCard({
  refreshTrigger,
}: TypingMetricsCardProps) {
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

  const recentPatterns = patterns.slice(-7);
  const avgTypingSpeed = recentPatterns.length
    ? recentPatterns.reduce((acc, p) => acc + p.typingSpeed, 0) /
      recentPatterns.length
    : 0;
  const avgErrorRate = recentPatterns.length
    ? recentPatterns.reduce((acc, p) => acc + p.errorRate, 0) /
      recentPatterns.length
    : 0;

  if (loading && patterns.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="text-3xl mb-2">📱</div>
      <h3 className="font-semibold text-lg">Escritura</h3>
      <p className="text-sm text-gray-500">Últimos 7 días</p>
      <div className="mt-2">
        {recentPatterns.length > 0 ? (
          <>
            <p className="text-sm">
              <span className="font-bold">Velocidad:</span>{" "}
              {avgTypingSpeed.toFixed(1)} cps
            </p>
            <p className="text-sm">
              <span className="font-bold">Errores:</span>{" "}
              {avgErrorRate.toFixed(1)}%
            </p>
          </>
        ) : (
          <p className="text-gray-400">Sin datos aún</p>
        )}
      </div>
    </div>
  );
}

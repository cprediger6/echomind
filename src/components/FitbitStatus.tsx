// src/components/FitbitStatus.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FitbitStatusProps {
  initialHasFitbit: boolean;
  userId: string;
}

export default function FitbitStatus({
  initialHasFitbit,
  userId,
}: FitbitStatusProps) {
  const [hasFitbit, setHasFitbit] = useState(initialHasFitbit);
  const [syncing, setSyncing] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/fitbit/sync/sleep", {
        method: "POST",
      });
      if (res.ok) {
        alert("Sincronización completada");
        router.refresh(); // Recarga datos del servidor
      } else {
        alert("Error al sincronizar");
      }
    } catch (error) {
      console.error(error);
      alert("Error de red");
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("¿Estás seguro de que quieres desconectar Fitbit?")) return;
    try {
      const res = await fetch("/api/fitbit/disconnect", {
        method: "POST",
      });
      if (res.ok) {
        setHasFitbit(false);
        router.refresh();
      } else {
        alert("Error al desconectar");
      }
    } catch (error) {
      console.error(error);
      alert("Error de red");
    }
  };

  if (!hasFitbit) {
    return (
      <Link
        href="/fitbit/connect"
        className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M7 17L17 7M17 7H8M17 7V16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Conectar Fitbit
      </Link>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
        <span className="text-sm text-gray-700">Fitbit conectado</span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleSync}
          disabled={syncing}
          className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          {syncing ? "Sincronizando..." : "Sincronizar ahora"}
        </button>
        <button
          onClick={handleDisconnect}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Desconectar
        </button>
      </div>
    </div>
  );
}

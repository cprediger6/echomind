// src/components/ConnectFitbitButton.tsx
"use client";

import { useState } from "react";

export default function ConnectFitbitButton() {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/fitbit/auth-url");
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error al generar la URL de autorización");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50"
    >
      {loading ? (
        "Conectando..."
      ) : (
        <>
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Conectar con Fitbit
        </>
      )}
    </button>
  );
}

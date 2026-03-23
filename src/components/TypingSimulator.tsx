// src/components/TypingSimulator.tsx
"use client";

import { useState } from "react";

export default function TypingSimulator() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendMockData = async () => {
    setLoading(true);
    setMessage("");

    // Datos simulados
    const mockData = {
      typingSpeed: Math.random() * 5 + 2, // entre 2 y 7 cps
      errorRate: Math.random() * 20, // entre 0 y 20%
      pauseCount: Math.floor(Math.random() * 10),
      sessionTime: Math.floor(Math.random() * 300) + 60, // entre 60 y 360 seg
    };

    try {
      const res = await fetch("/api/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockData),
      });

      if (res.ok) {
        setMessage("✅ Datos enviados correctamente");
        // Recargar la página para ver los nuevos datos (opcional)
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage("❌ Error al enviar datos");
      }
    } catch (error) {
      setMessage("❌ Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mt-8">
      <h3 className="text-lg font-semibold mb-4">
        Simulador de escritura (pruebas)
      </h3>
      <button
        onClick={sendMockData}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Enviar datos de prueba"}
      </button>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
}

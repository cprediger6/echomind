// src/components/BeckForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { preguntas } from "@/app/beck/questions";

type Answers = Record<number, string>; // Guarda el optionId seleccionado

export default function BeckForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelect = (preguntaId: number, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [preguntaId]: optionId }));
  };

  const todasRespondidas = () => {
    return preguntas.every((p) => answers[p.id] !== undefined);
  };

  const calcularPuntaje = (): number => {
    let total = 0;
    preguntas.forEach((pregunta) => {
      const selectedOptionId = answers[pregunta.id];
      if (selectedOptionId) {
        const opcion = pregunta.opciones.find(
          (o) => o.optionId === selectedOptionId,
        );
        if (opcion) total += opcion.valor;
      }
    });
    return total;
  };

  const obtenerNivel = (puntaje: number): string => {
    if (puntaje <= 13) return "mínimo";
    if (puntaje <= 19) return "leve";
    if (puntaje <= 28) return "moderado";
    return "severo";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todasRespondidas()) {
      setError("Por favor responde todas las preguntas.");
      return;
    }

    setLoading(true);
    setError("");

    const total = calcularPuntaje();
    const level = obtenerNivel(total);

    try {
      const res = await fetch("/api/beck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          answers,
          totalScore: total,
          level,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al guardar");
      }

      router.push("/dashboard?beck=completado");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {preguntas.map((pregunta) => (
        <div key={pregunta.id} className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-3">
            {pregunta.id}. {pregunta.texto}
          </h3>
          <div className="space-y-2">
            {pregunta.opciones.map((opcion) => {
              const isSelected = answers[pregunta.id] === opcion.optionId;
              return (
                <div
                  key={opcion.optionId}
                  onClick={() => handleSelect(pregunta.id, opcion.optionId)}
                  className={`flex items-start space-x-3 p-2 rounded cursor-pointer transition ${
                    isSelected ? "bg-blue-100" : "hover:bg-gray-100"
                  }`}
                >
                  {/* Radio oculto pero funcional para accesibilidad */}
                  <input
                    type="radio"
                    name={`pregunta-${pregunta.id}`}
                    value={opcion.optionId}
                    checked={isSelected}
                    onChange={() => {}} // Vacío porque manejamos el clic en el div
                    className="mt-1 opacity-0 w-0 h-0" // Oculto visualmente
                    tabIndex={-1} // No enfocable, el div maneja el foco
                  />
                  <span
                    className={`text-sm text-gray-700 ${isSelected ? "font-medium" : ""}`}
                  >
                    {opcion.texto}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-3 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Ver resultado"}
      </button>

      <p className="text-xs text-gray-500 mt-4">
        * Este test es una herramienta de evaluación inicial. No constituye un
        diagnóstico definitivo. Si tienes inquietudes, consulta a un profesional
        de la salud mental.
      </p>
    </form>
  );
}

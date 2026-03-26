"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const INACTIVITY_TIMEOUT = 10000;

const SAMPLE_TEXT =
  "Escribe este texto de prueba para medir tu velocidad de escritura y precisión. Intenta ser natural, no te preocupes por los errores, solo escribe como lo harías normalmente.";

interface TypingTestProps {
  userId: string;
  onSaveComplete?: () => void; // optional callback after successful save
}

export default function TypingTest({
  userId,
  onSaveComplete,
}: TypingTestProps) {
  const [text, setText] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [lastKeyTime, setLastKeyTime] = useState<number | null>(null);
  const [pauseCount, setPauseCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const saveTypingData = useCallback(async () => {
    if (!userId || !startTime || !lastKeyTime) return;

    const endTime = Date.now();
    const sessionTime = Math.round((endTime - startTime) / 1000);
    const typingSpeed = text.length / sessionTime;

    const payload = {
      typingSpeed: parseFloat(typingSpeed.toFixed(2)),
      errorRate: parseFloat(
        ((errorCount / Math.max(text.length, 1)) * 100).toFixed(2),
      ),
      pauseCount,
      sessionTime,
    };

    setSaving(true);
    try {
      const res = await fetch("/api/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMessage("✅ Datos guardados correctamente");
        setIsActive(false);
        setStartTime(null);
        setLastKeyTime(null);
        setPauseCount(0);
        setErrorCount(0);
        setText("");
        if (onSaveComplete) onSaveComplete(); // notify parent to refresh data
      } else {
        setMessage("❌ Error al guardar");
      }
    } catch {
      setMessage("❌ Error de red");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  }, [
    userId,
    startTime,
    lastKeyTime,
    text,
    errorCount,
    pauseCount,
    onSaveComplete,
  ]);

  useEffect(() => {
    if (isActive && lastKeyTime) {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(() => {
        if (isActive) saveTypingData();
      }, INACTIVITY_TIMEOUT);
    }
    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [isActive, lastKeyTime, saveTypingData]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const now = Date.now();

    if (!isActive) {
      setIsActive(true);
      setStartTime(now);
      setLastKeyTime(now);
      setPauseCount(0);
      setErrorCount(0);
      setText("");
      return;
    }

    if (lastKeyTime && now - lastKeyTime > 2000) {
      setPauseCount((prev) => prev + 1);
    }

    if (e.key === "Backspace") {
      setErrorCount((prev) => prev + 1);
    }

    setLastKeyTime(now);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleBlur = () => {
    if (isActive) saveTypingData();
  };

  const handleManualSave = () => {
    if (isActive) saveTypingData();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Prueba de escritura</h3>
      <p className="text-sm text-gray-600 mb-2">Escribe el siguiente texto:</p>
      <div className="bg-gray-100 p-4 rounded mb-4 text-gray-800">
        {SAMPLE_TEXT}
      </div>
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={saving}
        rows={5}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        placeholder="Comienza a escribir aquí..."
      />
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {isActive ? (
            <>
              <span>Caracteres: {text.length}</span>
              <span className="mx-2">|</span>
              <span>Pausas largas: {pauseCount}</span>
              <span className="mx-2">|</span>
              <span>Correcciones: {errorCount}</span>
            </>
          ) : (
            <span>Escribe para comenzar la prueba</span>
          )}
        </div>
        <button
          onClick={handleManualSave}
          disabled={!isActive || saving}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 transition"
        >
          {saving ? "Guardando..." : "Guardar manualmente"}
        </button>
      </div>
      {message && (
        <div className="mt-2 text-sm text-center text-gray-700">{message}</div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import MoodCharacter from "./MoodCharacter";

export default function MoodWidget() {
  const [todayMood, setTodayMood] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar el estado de ánimo actual
  useEffect(() => {
    fetch("/api/mood")
      .then((res) => res.json())
      .then((data) => {
        // data es un array, el último es el más reciente (hoy)
        const lastEntry = data[data.length - 1];
        if (lastEntry) {
          const entryDate = new Date(lastEntry.date);
          const today = new Date();
          if (entryDate.toDateString() === today.toDateString()) {
            setTodayMood(lastEntry.moodScore);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleMoodSelect = async (score: number) => {
    setTodayMood(score);
    try {
      await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moodScore: score }),
      });
    } catch (error) {
      console.error("Error guardando ánimo", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        Cargando...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Mi estado de ánimo
      </h2>
      <MoodCharacter mood={todayMood} onMoodSelect={handleMoodSelect} />
    </div>
  );
}

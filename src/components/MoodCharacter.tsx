"use client";

import { useState, useEffect } from "react";

interface MoodCharacterProps {
  mood: number | null; // 1–5, null si aún no ha elegido hoy
  onMoodSelect?: (score: number) => void;
}

export default function MoodCharacter({
  mood,
  onMoodSelect,
}: MoodCharacterProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(mood);
  const [animating, setAnimating] = useState(false);

  // Emoji o imagen según el ánimo
  const getMoodEmoji = (score: number) => {
    switch (score) {
      case 1:
        return "😞";
      case 2:
        return "😕";
      case 3:
        return "😐";
      case 4:
        return "🙂";
      case 5:
        return "😄";
      default:
        return "🤔";
    }
  };

  const getMoodColor = (score: number) => {
    switch (score) {
      case 1:
        return "bg-red-100 border-red-300";
      case 2:
        return "bg-orange-100 border-orange-300";
      case 3:
        return "bg-yellow-100 border-yellow-300";
      case 4:
        return "bg-green-100 border-green-300";
      case 5:
        return "bg-emerald-100 border-emerald-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const handleMoodClick = (score: number) => {
    setSelectedMood(score);
    setAnimating(true);
    if (onMoodSelect) onMoodSelect(score);
    setTimeout(() => setAnimating(false), 300);
  };

  useEffect(() => {
    setSelectedMood(mood);
  }, [mood]);

  const currentEmoji = selectedMood ? getMoodEmoji(selectedMood) : "🤔";
  const currentColor = selectedMood
    ? getMoodColor(selectedMood)
    : "bg-gray-100 border-gray-300";

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-md transition-all duration-300 ${currentColor} ${
          animating ? "scale-110" : "scale-100"
        }`}
      >
        {currentEmoji}
      </div>
      <div className="flex gap-2 mt-4">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            onClick={() => handleMoodClick(score)}
            className={`text-2xl p-2 rounded-full transition hover:scale-110 ${
              selectedMood === score ? "ring-2 ring-blue-500 bg-blue-50" : ""
            }`}
            title={
              score === 1
                ? "Muy mal"
                : score === 2
                  ? "Mal"
                  : score === 3
                    ? "Neutral"
                    : score === 4
                      ? "Bien"
                      : "Muy bien"
            }
          >
            {getMoodEmoji(score)}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        {selectedMood ? "¡Gracias por compartir!" : "¿Cómo te sientes hoy?"}
      </p>
    </div>
  );
}

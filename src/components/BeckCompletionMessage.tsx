// src/components/BeckCompletionMessage.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BeckCompletionMessage() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams.get("beck") === "completado") {
      setShow(true);
      // Ocultar después de 5 segundos
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (!show) return null;

  return (
    <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
      <p>¡Test completado! Ya puedes ver tu resultado.</p>
    </div>
  );
}

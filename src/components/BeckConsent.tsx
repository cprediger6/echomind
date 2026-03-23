// src/components/BeckConsent.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BeckForm from "./BeckForm";

export default function BeckConsent({ userId }: { userId: string }) {
  const [consentGiven, setConsentGiven] = useState(false);
  const router = useRouter();

  if (consentGiven) {
    return <BeckForm userId={userId} />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <div className="flex">
          <span className="text-yellow-400 text-xl mr-3">⚠️</span>
          <div>
            <p className="font-bold text-yellow-700">Aviso importante</p>
            <p className="text-sm text-yellow-600">
              Si los resultados de este test son de nivel{" "}
              <strong>moderado</strong> o <strong>severo</strong>, se enviará
              una notificación por correo electrónico y WhatsApp a:
            </p>
            <ul className="list-disc list-inside text-sm text-yellow-600 mt-2">
              <li>Tu profesional de salud mental registrado</li>
              <li>Tu contacto de emergencia (familiar/amigo)</li>
            </ul>
            <p className="text-sm text-yellow-600 mt-2">
              Esta información es confidencial y solo se compartirá con las
              personas que hayas autorizado previamente.
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setConsentGiven(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Aceptar y continuar
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

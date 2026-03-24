// src/components/AlertSupport.tsx
"use client";

import { useEffect, useState } from "react";
import { buildWhatsAppURL, isValidPhone } from "@/lib/whatsapp";

type Contact = {
  name: string;
  phone: string;
};

export default function AlertSupport({
  level,
  userName,
}: {
  level: string;
  userName?: string;
}) {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    fetch("/api/contacts")
      .then((res) => res.json())
      .then((data) => setContacts(data.contacts || []));
  }, []);

  const getMessage = () => {
    if (level === "severo") {
      return `Hola, soy ${userName || "yo"}.
Estoy pasando por un momento difícil y necesito ayuda.`;
    }

    return `Hola, no me estoy sintiendo bien y me gustaría hablar contigo.`;
  };

  const handleSend = async (phone: string) => {
    if (!isValidPhone(phone)) {
      alert("Número inválido");
      return;
    }

    // ✅ 1. Abrir WhatsApp
    const url = buildWhatsAppURL(phone, getMessage());
    window.open(url, "_blank");

    // ✅ 2. Enviar emails en background
    try {
      await fetch("/api/notify", {
        method: "POST",
      });
    } catch (error) {
      console.error("Error enviando email", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full text-center">
        <h2 className="text-xl font-bold text-red-600 mb-3">
          ⚠️ Podrías necesitar apoyo
        </h2>

        <p className="text-gray-700 mb-4">
          ¿Quieres avisar a alguien de confianza?
        </p>

        <div className="space-y-2">
          {contacts.map((c, i) => (
            <button
              key={i}
              onClick={() => handleSend(c.phone)}
              className="w-full bg-green-500 text-white py-2 rounded"
            >
              Enviar ayuda a {c.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => (window.location.href = "/beck/resultado")}
          className="mt-4 text-sm text-blue-600 underline"
        >
          Ver resultado
        </button>
      </div>
    </div>
  );
}

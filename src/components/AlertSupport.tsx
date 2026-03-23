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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contacts")
      .then((res) => res.json())
      .then((data) => {
        setContacts(data.contacts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getMessage = () => {
    if (level === "severo") {
      return `Hola, soy ${userName || "yo"}.
Estoy pasando por un momento muy difícil y necesito ayuda urgente.
Por favor contáctame lo antes posible.`;
    }

    return `Hola, no me estoy sintiendo bien y me gustaría hablar contigo.`;
  };

  const handleSend = (phone: string) => {
    if (!isValidPhone(phone)) {
      alert("Número inválido");
      return;
    }

    const url = buildWhatsAppURL(phone, getMessage());
    window.open(url, "_blank");
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h2 className="text-xl font-bold text-red-600 mb-3">
          ⚠️ Necesitas apoyo
        </h2>

        <p className="text-gray-700 mb-5">
          Detectamos que podrías estar pasando por un momento difícil. ¿Quieres
          notificar a tus contactos de confianza?
        </p>

        <div className="space-y-3">
          {contacts.map((c, i) => (
            <button
              key={i}
              onClick={() => handleSend(c.phone)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
            >
              Enviar mensaje a {c.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm text-gray-500 underline"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

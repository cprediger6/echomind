// src/components/AlertSupport.tsx
"use client";

import { useEffect, useState } from "react";
import { buildWhatsAppURL, isValidPhone } from "@/lib/whatsapp";

type Contact = {
  name: string;
  phone: string;
  email?: string; // 🔥 IMPORTANTE
};

export default function AlertSupport({
  level,
  userName,
}: {
  level: string;
  userName?: string;
}) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

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

  const handleSend = async (contact: Contact) => {
    if (!isValidPhone(contact.phone)) {
      alert("Número inválido");
      return;
    }

    setLoading(true);

    // ✅ 1. WhatsApp (instantáneo)
    const url = buildWhatsAppURL(contact.phone, getMessage());
    window.open(url, "_blank");

    // ✅ 2. Email (backend con Resend)
    try {
      await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contacts: [contact], // 🔥 solo el seleccionado
          message: getMessage(),
        }),
      });
    } catch (error) {
      console.error("Error enviando email", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full text-center shadow-lg">
        <h2 className="text-xl font-bold text-red-600 mb-3">
          ⚠️ Podrías necesitar apoyo
        </h2>

        <p className="text-gray-800 mb-4">
          ¿Quieres avisar a alguien de confianza?
        </p>

        <div className="space-y-2">
          {contacts.map((c, i) => (
            <button
              key={i}
              onClick={() => handleSend(c)}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-50"
            >
              {loading ? "Enviando..." : `Enviar ayuda a ${c.name}`}
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

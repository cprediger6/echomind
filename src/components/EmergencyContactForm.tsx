// src/components/EmergencyContactForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Contact {
  id?: string;
  name: string;
  relationship: string;
  email: string;
  phone?: string;
}

export default function EmergencyContactForm({
  userId,
  existingContact,
}: {
  userId: string;
  existingContact?: Contact | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: existingContact?.name || "",
    relationship: existingContact?.relationship || "familiar",
    email: existingContact?.email || "",
    phone: existingContact?.phone || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/emergency-contact", {
        method: existingContact ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId }),
      });

      if (!res.ok) throw new Error("Error al guardar");

      router.push("/dashboard?contact=saved");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nombre completo
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Relación
        </label>
        <select
          value={form.relationship}
          onChange={(e) => setForm({ ...form, relationship: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
        >
          <option value="familiar">Familiar</option>
          <option value="amigo">Amigo</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Teléfono (opcional)
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading
          ? "Guardando..."
          : existingContact
            ? "Actualizar contacto"
            : "Guardar contacto"}
      </button>
    </form>
  );
}

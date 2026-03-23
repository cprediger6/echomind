// src/components/MentalHealthProForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Pro {
  id?: string;
  name: string;
  specialty: string;
  email: string;
  phone?: string;
  clinic?: string;
}

export default function MentalHealthProForm({
  userId,
  existingPro,
}: {
  userId: string;
  existingPro?: Pro | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: existingPro?.name || "",
    specialty: existingPro?.specialty || "",
    email: existingPro?.email || "",
    phone: existingPro?.phone || "",
    clinic: existingPro?.clinic || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/mental-health-pro", {
        method: existingPro ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId }),
      });

      if (!res.ok) throw new Error("Error al guardar");

      router.push("/dashboard?pro=saved");
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
          Especialidad
        </label>
        <input
          type="text"
          placeholder="Ej. Psicólogo, Psiquiatra"
          value={form.specialty}
          onChange={(e) => setForm({ ...form, specialty: e.target.value })}
          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-2"
        />
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
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Clínica / Consultorio (opcional)
        </label>
        <input
          type="text"
          value={form.clinic}
          onChange={(e) => setForm({ ...form, clinic: e.target.value })}
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
          : existingPro
            ? "Actualizar profesional"
            : "Guardar profesional"}
      </button>
    </form>
  );
}

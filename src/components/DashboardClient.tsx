"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FitbitSleepLog,
  EmergencyContact,
  MentalHealthProfessional,
} from "@prisma/client";
import TypingDataDisplay from "./TypingDataDisplay";
import TypingMetricsCard from "./TypingMetricsCard";
import MoodWidget from "./MoodWidget";
import SleepSummaryCard from "./SleepSummaryCard";

interface DashboardClientProps {
  userId: string;
  user: {
    email: string;
    createdAt: Date | null;
  };
  userHasFitbit: boolean;
  latestSleep: FitbitSleepLog | null;
  emergencyContact: EmergencyContact | null;
  mentalHealthPro: MentalHealthProfessional | null;
  missingContacts: string[];
}

export default function DashboardClient({
  userId,
  user,
  userHasFitbit,
  latestSleep,
  emergencyContact,
  mentalHealthPro,
  missingContacts,
}: DashboardClientProps) {
  const [typingRefresh, setTypingRefresh] = useState(0);

  const handleTypingSave = () => {
    setTypingRefresh((prev) => prev + 1);
  };

  // Convertir el objeto de sueño de Prisma al formato esperado por SleepSummaryCard
  const sleepCardData = latestSleep
    ? {
        id: latestSleep.id,
        startTime: latestSleep.startTime.toISOString(),
        endTime: latestSleep.endTime.toISOString(),
        duration: latestSleep.duration,
        efficiency: latestSleep.efficiency,
        minutesAsleep: latestSleep.minutesAsleep,
        minutesAwake: latestSleep.minutesAwake,
        minutesToFallAsleep: latestSleep.minutesToFallAsleep,
        timeInBed: latestSleep.timeInBed,
        sleepLevelDeep: latestSleep.sleepLevelDeep,
        sleepLevelLight: latestSleep.sleepLevelLight,
        sleepLevelRem: latestSleep.sleepLevelRem,
        sleepLevelWake: latestSleep.sleepLevelWake,
        isMainSleep: latestSleep.isMainSleep,
      }
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tarjeta de usuario */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Tu información
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Miembro desde</p>
            <p className="font-medium">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("es-ES")
                : "Fecha no disponible"}
            </p>
          </div>
        </div>

        {/* Fitbit */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">
            Dispositivos conectados
          </h3>
          {!userHasFitbit ? (
            <Link
              href="/fitbit/connect"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>Conectar Fitbit</span>
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-700">Fitbit conectado</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => alert("Funcionalidad en desarrollo")}
                  className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
                >
                  Sincronizar ahora
                </button>
                <button
                  onClick={() => alert("Funcionalidad en desarrollo")}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Desconectar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contactos */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Mis contactos</h2>
        {missingContacts.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <div className="flex">
              <span className="text-yellow-400 text-xl mr-3">⚠️</span>
              <div>
                <p className="font-bold text-yellow-700">
                  Contactos pendientes
                </p>
                <p className="text-sm text-yellow-600">
                  Para recibir alertas, registra tu{" "}
                  {missingContacts.join(" y ")}.
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Emergencia */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="text-2xl">🆘</span> Contacto de emergencia
            </h3>
            {emergencyContact ? (
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">Nombre:</span>{" "}
                  {emergencyContact.name}
                </p>
                <p>
                  <span className="text-gray-600">Relación:</span>{" "}
                  {emergencyContact.relationship}
                </p>
                <p>
                  <span className="text-gray-600">Email:</span>{" "}
                  {emergencyContact.email}
                </p>
                {emergencyContact.phone && (
                  <p>
                    <span className="text-gray-600">Teléfono:</span>{" "}
                    {emergencyContact.phone}
                  </p>
                )}
                <Link
                  href="/emergency-contact"
                  className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Editar
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 mb-3">
                  No has registrado un contacto de emergencia.
                </p>
                <Link
                  href="/emergency-contact"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Agregar
                </Link>
              </div>
            )}
          </div>

          {/* Profesional */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="text-2xl">👨‍⚕️</span> Profesional de salud mental
            </h3>
            {mentalHealthPro ? (
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">Nombre:</span>{" "}
                  {mentalHealthPro.name}
                </p>
                <p>
                  <span className="text-gray-600">Especialidad:</span>{" "}
                  {mentalHealthPro.specialty || "No especificada"}
                </p>
                <p>
                  <span className="text-gray-600">Email:</span>{" "}
                  {mentalHealthPro.email}
                </p>
                {mentalHealthPro.phone && (
                  <p>
                    <span className="text-gray-600">Teléfono:</span>{" "}
                    {mentalHealthPro.phone}
                  </p>
                )}
                {mentalHealthPro.clinic && (
                  <p>
                    <span className="text-gray-600">Clínica:</span>{" "}
                    {mentalHealthPro.clinic}
                  </p>
                )}
                <Link
                  href="/mental-health-pro"
                  className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Editar
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 mb-3">
                  No has registrado un profesional.
                </p>
                <Link
                  href="/mental-health-pro"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Agregar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Diario de ánimo */}
      <div className="mb-8">
        <MoodWidget />
      </div>

      {/* Botones de Beck + informe */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/beck"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-center"
          >
            Realizar test de Beck
          </Link>
          <Link
            href="/beck/resultado"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-center"
          >
            Ver resultados Beck
          </Link>
          <Link
            href="/dashboard/report"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-center"
          >
            Ver informe combinado
          </Link>
        </div>
      </div>

      {/* Cuadrícula de métricas (4 tarjetas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <TypingMetricsCard refreshTrigger={typingRefresh} />
        <SleepSummaryCard sleepData={sleepCardData} />
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl mb-2">🚶</div>
          <h3 className="font-semibold text-lg">Actividad</h3>
          <p className="text-sm text-gray-500">Próximamente</p>
          <div className="mt-2 text-gray-400">Sin datos</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-3xl mb-2">💬</div>
          <h3 className="font-semibold text-lg">Social</h3>
          <p className="text-sm text-gray-500">Próximamente</p>
          <div className="mt-2 text-gray-400">Sin datos</div>
        </div>
      </div>

      {/* Contenido completo de escritura (gráfica, tabla, test) */}
      <TypingDataDisplay
        userId={userId}
        refreshTrigger={typingRefresh}
        onSaveComplete={handleTypingSave}
      />
    </div>
  );
}

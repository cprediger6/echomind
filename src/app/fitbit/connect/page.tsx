// src/app/fitbit/connect/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ConnectFitbitButton from "@/components/ConnectFitbitButton";

import PieDePagina from "@/components/PieDePagina";
import Nav from "@/components/nav";
export default async function ConnectFitbitPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Verificar si ya tiene Fitbit conectado
  const existingDevice = await prisma.connectedDevice.findUnique({
    where: {
      userId_provider: {
        userId: session.user.id,
        provider: "fitbit",
      },
    },
  });

  // Si ya está conectado, redirigir al dashboard con un mensaje
  if (existingDevice) {
    redirect("/dashboard?fitbit=already");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Nav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cabecera con icono de Fitbit */}
          <div className="bg-blue-600 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
              <svg
                className="w-12 h-12 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M7 17L17 7M17 7H8M17 7V16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">Conecta tu Fitbit</h1>
            <p className="text-blue-100 mt-2">
              Sincroniza automáticamente tus datos de sueño y actividad
            </p>
          </div>

          {/* Contenido */}
          <div className="p-8">
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-700">
                  <strong>Privacidad ante todo:</strong> Solo leeremos los datos
                  que autorices. No publicaremos nada en tu nombre y puedes
                  revocar el acceso en cualquier momento.
                </p>
              </div>

              <h2 className="text-xl font-semibold text-gray-800">
                ¿Qué datos compartirás?
              </h2>
              <ul className="space-y-3">
                {[
                  {
                    icon: "🌙",
                    title: "Sueño",
                    desc: "Duración, calidad, fases (profundo, ligero, REM)",
                  },
                  {
                    icon: "🚶",
                    title: "Actividad diaria",
                    desc: "Pasos, distancia, calorías, minutos activos",
                  },
                  {
                    icon: "❤️",
                    title: "Frecuencia cardíaca",
                    desc: "Frecuencia cardíaca en reposo (opcional)",
                  },
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-medium text-gray-800">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-200 pt-6">
                <ConnectFitbitButton />
              </div>

              <p className="text-xs text-gray-500 text-center">
                Al conectar, aceptas que EchoMind acceda a los datos
                seleccionados según los
                <Link
                  href="/privacy"
                  className="text-blue-600 hover:underline mx-1"
                >
                  términos de privacidad
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
      <PieDePagina />
    </div>
  );
}

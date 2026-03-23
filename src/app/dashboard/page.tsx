// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LogoutButton from "@/components/LogoutButton";
import TypingChart from "@/components/TypingChart";
import Logo from "@/components/logo";
import PieDePagina from "@/components/PieDePagina";
import TypingTest from "@/components/TypingTest";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Verificar si el usuario tiene Fitbit conectado
  const fitbitDevice = await prisma.connectedDevice.findUnique({
    where: {
      userId_provider: {
        userId: session.user.id,
        provider: "fitbit",
      },
    },
  });
  const userHasFitbit = !!fitbitDevice;

  // Obtener contactos de emergencia y profesional
  const emergencyContact = await prisma.emergencyContact.findFirst({
    where: { userId: session.user.id },
  });

  const mentalHealthPro = await prisma.mentalHealthProfessional.findFirst({
    where: { userId: session.user.id },
  });

  // Determinar qué contactos faltan
  const missingContacts = [];
  if (!emergencyContact) missingContacts.push("contacto de emergencia");
  if (!mentalHealthPro) missingContacts.push("profesional de salud mental");

  // Obtener datos de escritura
  const typingPatterns = await prisma.typingPattern.findMany({
    where: { userId: session.user.id },
    orderBy: { timestamp: "asc" },
    take: 30,
  });

  const recentPatterns = typingPatterns.slice(-7);
  const avgTypingSpeed = recentPatterns.length
    ? recentPatterns.reduce(
        (acc: number, p: { typingSpeed: number }) => acc + p.typingSpeed,
        0,
      ) / recentPatterns.length
    : 0;
  const avgErrorRate = recentPatterns.length
    ? recentPatterns.reduce(
        (acc: number, p: { errorRate: number }) => acc + p.errorRate,
        0,
      ) / recentPatterns.length
    : 0;

  const lastPattern = typingPatterns[typingPatterns.length - 1];
  const recentTests = [...typingPatterns].reverse().slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Logo width={100} height={100} />
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Hola, {session.user?.name || "Usuario"}
            </span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tarjeta de información del usuario */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Tu información
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{session.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Miembro desde</p>
              <p className="font-medium">
                {session.user.createdAt
                  ? new Date(session.user.createdAt).toLocaleDateString("es-ES")
                  : "Fecha no disponible"}
              </p>
            </div>
          </div>

          {/* Sección de dispositivos conectados */}
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
                  <span className="text-sm text-gray-700">
                    Fitbit conectado
                  </span>
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

        {/* SECCIÓN DE CONTACTOS */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Mis contactos
          </h2>

          {/* Alerta de contactos pendientes (si faltan) */}
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

          {/* Grid de contactos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contacto de emergencia */}
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

            {/* Profesional de salud mental */}
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

        {/* Botones de Beck */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </div>

        {/* Tarjetas de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Escritura */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">📱</div>
            <h3 className="font-semibold text-lg">Escritura</h3>
            <p className="text-sm text-gray-500">Últimos 7 días</p>
            <div className="mt-2">
              {recentPatterns.length > 0 ? (
                <>
                  <p className="text-sm">
                    <span className="font-bold">Velocidad:</span>{" "}
                    {avgTypingSpeed.toFixed(1)} cps
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">Errores:</span>{" "}
                    {avgErrorRate.toFixed(1)}%
                  </p>
                </>
              ) : (
                <p className="text-gray-400">Sin datos aún</p>
              )}
            </div>
          </div>

          {/* Sueño (placeholder) */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">🌙</div>
            <h3 className="font-semibold text-lg">Sueño</h3>
            <p className="text-sm text-gray-500">Próximamente</p>
            <div className="mt-2 text-gray-400">Sin datos</div>
          </div>

          {/* Actividad (placeholder) */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">🚶</div>
            <h3 className="font-semibold text-lg">Actividad</h3>
            <p className="text-sm text-gray-500">Próximamente</p>
            <div className="mt-2 text-gray-400">Sin datos</div>
          </div>

          {/* Social (placeholder) */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="font-semibold text-lg">Social</h3>
            <p className="text-sm text-gray-500">Próximamente</p>
            <div className="mt-2 text-gray-400">Sin datos</div>
          </div>
        </div>

        {/* Gráfica de tendencias */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Tendencias de escritura
          </h3>
          <TypingChart data={typingPatterns} />
        </div>

        {/* Historial de pruebas de escritura */}
        {recentTests.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">
              Últimas pruebas de escritura
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Velocidad (cps)
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Errores (%)
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pausas
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duración (s)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentTests.map((test) => (
                    <tr key={test.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {new Date(test.timestamp).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {test.typingSpeed.toFixed(1)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {test.errorRate.toFixed(1)}%
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {test.pauseCount}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {test.sessionTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Componente de prueba de escritura */}
        <TypingTest userId={session.user.id} />

        {/* Alerta de ejemplo */}
        {lastPattern && lastPattern.errorRate > 15 && (
          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <span className="text-yellow-400 text-xl mr-3">⚠️</span>
              <div>
                <p className="font-bold text-yellow-700">
                  Notamos algo diferente
                </p>
                <p className="text-sm text-yellow-600">
                  Tu tasa de errores al escribir ha aumentado. ¿Todo bien?
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <PieDePagina />
    </div>
  );
}

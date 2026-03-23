// src/app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">EchoMind</h1>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Registrarse
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">
          Tu compañero de <span className="text-blue-600">salud mental</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          EchoMind aprende tu rutina diaria y detecta cambios sutiles en tu
          comportamiento antes de que tú mismo los notes. Como un amigo que
          siempre está ahí.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Comenzar gratis
          </Link>
          <Link
            href="#como-funciona"
            className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition"
          >
            Cómo funciona
          </Link>
        </div>
      </section>

      {/* Características */}
      <section id="como-funciona" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Cómo te ayuda EchoMind?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "📱",
                title: "Patrones de escritura",
                description:
                  "Analizamos cómo escribes: velocidad, errores y pausas para detectar cambios en tu estado de ánimo.",
              },
              {
                icon: "🌙",
                title: "Sueño",
                description:
                  "Monitoreamos tus patrones de sueño y uso nocturno del teléfono.",
              },
              {
                icon: "🚶",
                title: "Actividad física",
                description:
                  "Detectamos cambios en tu nivel de actividad que podrían indicar algo.",
              },
              {
                icon: "💬",
                title: "Vida social",
                description:
                  "Observamos cambios en tu comunicación: menos mensajes, menos llamadas.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-blue-50 p-6 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de cómo funciona */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Detectamos lo que otros no ven
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              La mayoría de apps requieren que ya sepas que tienes un problema.
              EchoMind lo detecta antes, como un amigo cercano que nota que algo
              cambió.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">
                  100% privado - todo se procesa en tu dispositivo
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">
                  Detección temprana de cambios emocionales
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">
                  Sin necesidad de escribir diarios o cuestionarios
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-blue-600 text-white p-8 rounded-2xl">
            <h4 className="text-2xl font-bold mb-4">¿Sabías que...?</h4>
            <p className="text-lg mb-4">
              Los cambios en la forma de escribir pueden predecir episodios de
              depresión con hasta 2 semanas de anticipación.
            </p>
            <p className="text-blue-100">
              EchoMind usa IA para detectar estos patrones y ayudarte a tiempo.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>© 2025 EchoMind. Todos los derechos reservados.</p>
          <p className="mt-2 text-sm">
            Hecho con ❤️ para cuidar la salud mental de todos
          </p>
        </div>
      </footer>
    </main>
  );
}

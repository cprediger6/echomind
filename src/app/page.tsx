import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import Logo from "@/components/logo";
import PieDePagina from "@/components/PieDePagina";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  // Si hay sesión activa, redirige al dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header - más sobrio */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Logo width={100} height={100} />
          <div className="space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-blue-700 transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800 transition shadow-sm"
            >
              Registrarse
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section - con datos relevantes */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            La salud mental es un derecho humano.
            <br />
            <span className="text-blue-700">EchoMind te acompaña.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Detectamos cambios sutiles en tu comportamiento antes de que los
            notes. Como un amigo que siempre está ahí, te ayudamos a cuidar tu
            bienestar emocional.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-800 transition shadow-md"
            >
              Comenzar gratis
            </Link>
            <Link
              href="#como-funciona"
              className="border border-blue-700 text-blue-700 px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-50 transition"
            >
              Cómo funciona
            </Link>
          </div>
        </div>
      </section>

      {/* Datos impactantes - estilo OPS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            El desafío en las Américas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="text-4xl font-bold text-blue-700 mb-2">77.9%</div>
              <p className="text-gray-600">
                de personas con trastornos mentales en América Latina y el
                Caribe no reciben tratamiento.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="text-4xl font-bold text-blue-700 mb-2">2.1%</div>
              <p className="text-gray-600">
                del presupuesto de salud se destina a salud mental en la Región.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <div className="text-4xl font-bold text-blue-700 mb-2">+17%</div>
              <p className="text-gray-600">
                aumento en tasas de suicidio en las Américas desde el año 2000.
              </p>
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-8">
            Fuente: Organización Panamericana de la Salud, 2024
          </p>
        </div>
      </section>

      {/* Contexto y explicación */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                La salud mental es más que la ausencia de trastornos
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Es un estado de bienestar que permite a las personas afrontar el
                estrés de la vida, desarrollar sus habilidades, aprender,
                trabajar y contribuir a su comunidad. EchoMind nace para
                ayudarte a mantener ese equilibrio.
              </p>
              <p className="text-lg text-gray-600">
                A través de la detección temprana de cambios en tu
                comportamiento, queremos reducir la brecha de tratamiento y
                promover el cuidado de la salud mental como un derecho humano
                fundamental.
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg border border-blue-100">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">
                Nuestra misión
              </h3>
              <p className="text-gray-700 mb-4">
                Que cada persona pueda acceder a una herramienta preventiva,
                gratuita y confiable que le ayude a identificar cambios
                emocionales antes de que se conviertan en un problema mayor.
              </p>
              <p className="text-gray-700">
                Creemos que la tecnología, cuando se usa con responsabilidad y
                ética, puede ser un aliado poderoso para la salud mental.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona EchoMind */}
      <section id="como-funciona" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Cómo te ayuda EchoMind?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "⌨️",
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
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué es diferente */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Detectamos lo que otros no ven
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                La mayoría de apps requieren que ya sepas que tienes un
                problema. EchoMind lo detecta antes, como un amigo cercano que
                nota que algo cambió.
              </p>
              <ul className="space-y-4">
                {[
                  "100% privado - todo se procesa en tu dispositivo",
                  "Detección temprana de cambios emocionales",
                  "Sin necesidad de escribir diarios o cuestionarios",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-700 text-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">¿Sabías que...?</h3>
              <p className="text-lg mb-4">
                Los cambios en la forma de escribir pueden predecir episodios de
                depresión con hasta 2 semanas de anticipación.
              </p>
              <p className="text-blue-100">
                EchoMind usa IA para detectar estos patrones y ayudarte a
                tiempo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Llamada a la acción final */}
      <section className="py-16 bg-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Únete a quienes ya cuidan su salud mental
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Empieza hoy. Es gratuito y no necesitas hacer nada especial.
            EchoMind trabaja en segundo plano para ti.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-blue-800 px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-100 transition shadow-md"
          >
            Crear cuenta gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <PieDePagina />
        </div>
      </footer>
    </main>
  );
}

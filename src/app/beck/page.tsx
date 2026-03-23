// src/app/beck/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import PieDePagina from "@/components/PieDePagina";
import Nav from "@/components/nav";
import BeckConsent from "@/components/BeckConsent";

export default async function BeckPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              Inventario de Depresión de Beck (BDI-II)
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              Este cuestionario consta de 21 grupos de afirmaciones. Por favor,
              lea cada grupo cuidadosamente y seleccione la frase que mejor
              describa cómo se ha sentido{" "}
              <strong>las últimas dos semanas, incluyendo el día de hoy</strong>
              . Si varios enunciados le parecen igualmente apropiados, marque el
              número más alto.
            </p>
            <BeckConsent userId={session.user.id} />
          </div>
        </div>
        <PieDePagina />
      </div>
    </div>
  );
}

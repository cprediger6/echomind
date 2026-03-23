// src/app/beck/resultado/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ResultadoBeck from "@/components/ResultadoBeck";
// src/app/beck/resultado/page.tsx

import AlertSupport from "@/components/AlertSupport";
import PieDePagina from "@/components/PieDePagina";
import Nav from "@/components/nav";
export default async function ResultadoPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Obtener el último test
  const ultimoTest = await prisma.beckInventory.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  if (!ultimoTest) {
    redirect("/beck?sinResultados");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-blue-600 mb-6">
            Resultado del Test de Beck
          </h1>
          <ResultadoBeck test={ultimoTest} />
          {(ultimoTest.level === "moderado" ||
            ultimoTest.level === "severo") && (
            <AlertSupport
              level={ultimoTest.level}
              userName={session.user.name ?? undefined}
            />
          )}
        </div>
      </div>
      <PieDePagina />
    </div>
  );
}

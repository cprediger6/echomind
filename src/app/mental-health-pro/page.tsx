// src/app/mental-health-pro/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MentalHealthProForm from "@/components/MentalHealthProForm";
import Nav from "@/components/nav";
export default async function MentalHealthProPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Cambiar findUnique por findFirst
  const existing = await prisma.mentalHealthProfessional.findFirst({
    where: { userId: session.user.id },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {" "}
      <Nav />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-blue-600 mb-4">
              Profesional de salud mental
            </h1>
            <p className="text-gray-600 mb-6">
              Registra los datos de tu psicólogo o psiquiatra para que pueda
              recibir alertas.
            </p>
            <MentalHealthProForm
              userId={session.user.id}
              existingPro={existing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

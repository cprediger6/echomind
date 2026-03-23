import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import LogoutButton from "@/components/LogoutButton";
import Logo from "@/components/logo";

export default async function Nav() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo width={60} height={60} />
          </div>

          {/* Usuario + botón */}
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-gray-600 text-xs sm:text-sm md:text-base truncate max-w-[120px] sm:max-w-none">
              Hola, {session.user?.name || "Usuario"}
            </span>

            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

// Layout del admin. Verifica sesión y expone el email + navegación.
// Cualquier ruta bajo /admin queda cubierta por este guard.

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOutAction } from "./acciones";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const navItems = [
    { href: "/admin", label: "Pacientes" },
    { href: "/admin/nuevo", label: "Cargar" },
    { href: "/admin/importar-csv", label: "Importar CSV" },
    { href: "/admin/importar-foto", label: "Foto" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-zinc-200">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-zinc-500 font-medium">
            Sesión iniciada
          </p>
          <p className="text-sm font-medium text-zinc-900 truncate">
            {user.email}
          </p>
        </div>
        <nav
          className="flex flex-wrap items-center gap-x-4 gap-y-2"
          aria-label="Navegación del admin"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="touch-target inline-flex items-center text-sm font-medium text-zinc-700 hover:text-zinc-900 underline underline-offset-2 px-2"
            >
              {item.label}
            </Link>
          ))}
          <form action={signOutAction} className="ml-auto sm:ml-2">
            <button
              type="submit"
              className="touch-target inline-flex items-center rounded-lg border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cerrar sesión
            </button>
          </form>
        </nav>
      </div>
      {children}
    </div>
  );
}
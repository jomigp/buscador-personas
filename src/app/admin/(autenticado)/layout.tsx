// Layout del admin. Verifica sesión y expone el email + botón de logout.
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-6">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-3">
        <div>
          <p className="text-xs text-zinc-500">Sesión iniciada como</p>
          <p className="text-sm font-medium text-zinc-900">{user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900 underline underline-offset-2"
          >
            Pacientes
          </Link>
          <Link
            href="/admin/nuevo"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900 underline underline-offset-2"
          >
            Cargar nuevo
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
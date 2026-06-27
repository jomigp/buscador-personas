// Login del personal de salud. Server Component: si ya hay sesión,
// redirige a /admin. El formulario es cliente (lee ?error=…).

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signInAction } from "../(autenticado)/acciones";
import LoginForm from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/admin");

  async function action(formData: FormData) {
    "use server";
    const result = await signInAction(formData);
    if (!result.ok) {
      const msg = encodeURIComponent(result.error ?? "Error desconocido");
      redirect(`/admin/login?error=${msg}`);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-16 space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Personal de salud
        </p>
        <h1 className="text-3xl font-bold text-zinc-900 leading-tight">
          Iniciá sesión
        </h1>
        <p className="text-sm text-zinc-600">
          Accedé con las credenciales de tu centro. Si no tenés una cuenta,
          contactá al administrador del proyecto.
        </p>
      </div>
      <LoginForm action={action} />
      <p className="text-xs text-zinc-500 text-center">
        ¿Sos familiar buscando a alguien?{" "}
        <Link href="/" className="text-zinc-700 underline underline-offset-2">
          Volvé al buscador público
        </Link>
        .
      </p>
    </div>
  );
}
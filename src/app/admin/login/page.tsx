// Login del personal de salud. Server Component: si ya hay sesión,
// redirige a /admin. El formulario es cliente (lee ?error=…).

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
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
    <div className="mx-auto max-w-md px-4 py-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-zinc-900">
          Acceso para personal de salud
        </h1>
        <p className="text-sm text-zinc-600">
          Inicia sesión con las credenciales de tu centro. Si no tienes una
          cuenta, contacta al administrador del proyecto.
        </p>
      </div>
      <LoginForm action={action} />
    </div>
  );
}
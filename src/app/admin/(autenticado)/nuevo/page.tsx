// Formulario de alta de paciente. Server Component que envuelve al
// formulario cliente; al enviar invoca crearPacienteAction.

import { createClient } from "@/lib/supabase/server";
import NuevoForm from "./nuevo-form";

export const dynamic = "force-dynamic";

export default async function NuevoPacientePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Sugerencia del último centro usado por este usuario (lee de localStorage
  // en el cliente; aquí no podemos). Como fallback, mostramos placeholder.
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Cargar nuevo paciente</h1>
        <p className="text-sm text-zinc-600 mt-1">
          Sesión: <span className="font-medium">{user?.email}</span>. Este dato
          quedará registrado como responsable de la carga.
        </p>
      </div>
      <NuevoForm />
    </div>
  );
}
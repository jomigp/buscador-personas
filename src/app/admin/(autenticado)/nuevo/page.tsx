// Formulario de alta de paciente. Server Component que envuelve al
// formulario cliente; al enviar invoca crearPacienteAction.

import { createClient } from "@/lib/supabase/server";
import { getDistinctValues } from "@/lib/centros";
import NuevoForm from "./nuevo-form";

export const dynamic = "force-dynamic";

export default async function NuevoPacientePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { centros, estados, municipios } = await getDistinctValues();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Cargar nuevo paciente</h1>
        <p className="text-sm text-zinc-600 mt-1">
          Sesión: <span className="font-medium">{user?.email}</span>. Este dato
          quedará registrado como responsable de la carga.
        </p>
      </div>
      <NuevoForm
        centros={centros}
        estados={estados}
        municipios={municipios}
      />
    </div>
  );
}
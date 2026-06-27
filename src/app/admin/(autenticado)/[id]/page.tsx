// Edición de un paciente. Server Component que carga el registro y
// pasa los datos a un formulario cliente que envía el update via action.

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EditarForm from "./editar-form";
import { publicFotoUrl } from "@/lib/supabase/storage";

export const dynamic = "force-dynamic";

export default async function EditarPacientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pacientes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) notFound();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Editar paciente</h1>
        <p className="text-sm text-zinc-600 mt-1">
          Modifica los datos y guarda. Los cambios se reflejan al instante.
        </p>
      </div>
      <EditarForm paciente={data} fotoUrl={publicFotoUrl(data.foto_path)} />
    </div>
  );
}